import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import get from "lodash.get";

import {
  getHazardName,
  ftypeMap
} from 'utils/sheldusUtils'

import {
	getChildGeo,
	getGeoMerge,
	getGeoMesh
} from 'store/modules/geo'

import * as d3scale from 'd3-scale'
import * as d3color from 'd3-color'
import * as d3format from "d3-format"
import { quantile } from "d3-array"
import { easeCubic } from "d3-ease"

import DeckMap from "components/mapping/escmap/DeckMap.react"
import MapTest from "components/mapping/escmap/MapTest.react"
import Viewport from "components/mapping/escmap/Viewport"

const format = d3format.format(".2f")

const getScale = () =>
	d3scale.scaleQuantize()
		.domain([0, 100])
		.range(["#f2efe9", "#fadaa6", "#f7c475", "#f09a10", "#cf4010"])
const getQuantileScale = () =>
	d3scale.scaleQuantile()
		.range(["#f2efe9", "#fadaa6", "#f7c475", "#f09a10", "#cf4010"])
const getHighRiskScale = () =>
	d3scale.scaleThreshold()
		.range(["#f2efe9", "#cf4010"])

const MAX_HEIGHT = 100000;
const getHeightScale = () =>
	d3scale.scaleLinear()
		.domain([0, 100])
		.range([0, MAX_HEIGHT])

const SOCIAL_SCORES = ['nri', 'bric', 'sovist', 'sovi', 'builtenv'];

class HazardMap extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			hoverData: null,
			viewport: Viewport(),
			scale: getScale(),
			heightScale: getHeightScale(),
			data: {
				type: "FeatureCollection",
				features: []
			},
			criticalData: {
				type: "FeatureCollection",
				features: []
			},
			asHeight: 'sovi',
			threeD: props.threeD,
			transitioning: false
		}
	}

	componentWillMount() {
		const { geoid } = this.props;
		this.props.getChildGeo(geoid.slice(0, 2), 'tracts');
		this.props.getChildGeo(geoid.slice(0, 2), 'counties');
		this.props.getGeoMerge(geoid.slice(0, 2), 'counties');
		this.props.getGeoMesh(geoid.slice(0, 2), 'counties');
		if (this.state.threeD) {
			// this.state.viewport.transition({ pitch: 45 });
			this.state.viewport.onViewportChange({ pitch: 45 });
		}
		else {
			// this.state.viewport.transition({ pitch: 0 });
			this.state.viewport.onViewportChange({ pitch: 0 });
		}
	}

	componentDidMount() {
		this.state.viewport.register(this, this.forceUpdate, false);
	}
	componentWillnmount() {
		this.state.viewport.unregister(this);
	}

	componentWillReceiveProps(newProps) {
		const { geoid } = this.props;
		if (geoid.length === 5) {
			const counties = newProps.geo[geoid.slice(0, 2)]['counties'].features,
				geo = counties.reduce((a, c) => c.properties.geoid === geoid ? c : a, null);
			if (geo) {
				this.state.viewport
					.fitGeojson(geo, { padding: 20 });
			}
		}
		else if (geoid.length === 2) {
			this.state.viewport
				.fitGeojson(newProps.geo['merge'][geoid]['counties'], { padding: 20 });
		}

		if ((newProps.hazard !== this.props.hazard) ||
			(newProps.highRisk && !this.props.highRisk)) {
			this.fetchFalcorDeps(newProps);
			this.processData(this.state.asHeight, newProps)
		}
	}

	fetchFalcorDeps({ geoid, geoLevel, hazard, highRisk } = this.props) {
		const requests = [];
		requests.push(["geo", geoid, geoLevel]);
		if (!SOCIAL_SCORES.includes(hazard)) {
			requests.push(["riskIndex", "meta", hazard, "name"]);
		}
		return this.props.falcor.get(...requests)
			.then(response => response.json.geo[geoid][geoLevel])
			.then(geoids => {
				if (!geoids.length) return;
				return this.props.falcor.get(
					["riskIndex", geoids, [hazard, 'sovi', 'builtenv'], 'score']
				)
				.then(() => geoids);
			})
			.then(geoids => this.processData())
	}

	fetchCriticalInfrastructure(geoids) {
		return this.props.falcor.get(
			['critical', 'byGeoid', geoids, 'length']
		)
		.then(response => {
			const data = response.json.critical.byGeoid;
			let max = 0;
			geoids.forEach(geoid => {
				max = Math.max(max, data[geoid].length);
			})
			return max;
		})
		.then(max => {
			if (max === 0) return;
			return this.props.falcor.get(
				['critical', 'byGeoid', geoids, 'byIndex', { from: 0, to: max -1 }, 'id']
			)
			.then(response => {
				const data = response.json.critical.byGeoid,
					ids = [];
				geoids.forEach(geoid => {
					for (let i = 0; i < max; ++i) {
						const indices = data[geoid].byIndex;
						if (indices[i]) {
							ids.push(indices[i].id)
						}
					}
				})
				return ids;
			})
			.then(ids => this.props.falcor.get(
				['critical', 'byId', ids, ['location', 'desc', 'name', 'address', 'ftype', 'fcode']]
			))
		})
		.then(() => this.processCriticalData())
	}
	processCriticalData() {
		let criticalData = {
			type: "FeatureCollection",
			features: []
		}
		try {
			const features = [];
			for (const id in this.props.critical.byId) {
				const data = this.props.critical.byId[id];
				features.push({
					type: "Feature",
					geometry: JSON.parse(data.location),
					properties: {
						...data
					}
				})
			}
			criticalData.features = features;
		}
		catch (e) {
			criticalData.features = [];
		}
		finally {
			this.setState({ criticalData });
		}
	}

	toggleAsHeight() {
		const asHeight = this.state.asHeight === 'builtenv' ? 'sovi' : 'builtenv';
		this.processData(asHeight);
	}
	toggleThreeD() {
		const threeD = !this.state.threeD,
			onTransitionEnd = () => this.setState({ transitioning: false });
		this.setState({ threeD, transitioning: true });
		if (threeD) {
			this.state.viewport.ease("pitch", 45, { onTransitionEnd });
		}
		else {
			this.state.viewport.ease("pitch", 0, { onTransitionEnd });
		}
	}

	processData(asHeight=this.state.asHeight, { geoid, geoLevel, hazard, highRisk } = this.props) {
		let scale = getScale(),

    		heightScale = getHeightScale(),

    		domain = [],

    		data = {
    			type: "FeatureCollection",
    			features: []
    		},

    		min = Infinity,
    		max = -Infinity,

    		minHeight = Infinity,
    		maxHeight = -Infinity;

    	try {
    		const geoData = this.props.geo[geoid.slice(0, 2)][geoLevel].features;
    		this.props.geoGraph[geoid][geoLevel].value.forEach(geoid => {
				if (this.props.riskIndex[geoid][hazard] === null) return;
    			let score = +this.props.riskIndex[geoid][hazard].score;
    			if (!isNaN(score) && score > -99) {
    				const geom = geoData.reduce((a, c) => c.properties.geoid === geoid ? c : a, null)
					if (geom) {
						const feature = JSON.parse(JSON.stringify(geom))
						feature.properties.score = score;
						feature.properties.height = 0;
						data.features.push(feature);

						min = Math.min(min, score);
						max = Math.max(max, score);

						domain.push(score);

						const heightValue = this.props.riskIndex[geoid][asHeight].score;
						if (heightValue > -99) {
							feature.properties.height = heightValue;
							minHeight = Math.min(minHeight, heightValue);
							maxHeight = Math.max(maxHeight, heightValue);
						}
					}
    			}
    		})
    		if (highRisk > 0.0) {
    			const qntl = quantile(domain.sort(), highRisk);
    			scale = getHighRiskScale()
    				.domain([qntl]);
    			const geoids = [];
    			data.features = data.features.filter(({ properties }) => {
    				if (properties.score >= qntl) {
    					geoids.push(properties.geoid);
    				}
    				return properties.score >= qntl;
    			})
    			this.fetchCriticalInfrastructure(geoids);
    		}
    		else if (SOCIAL_SCORES.includes(hazard)) {
    			scale = getQuantileScale()
    				.domain(domain);
    		}
    		heightScale.domain([minHeight , maxHeight]);
    	}
    	catch (e) {
// console.log("ERROR:",e)
    	}
    	this.setState({ scale, heightScale, data, asHeight });
	}

	generateLayers() {
		const { scale, heightScale, data, criticalData, viewport, threeD, transitioning } = this.state,

  			{ geoid } = this.props,

			{ width, pitch } = viewport(),

			elevationScale = (pitch / 45),

			getFillColor = ({ properties }) => {
				const value = get(properties, `score`, 0),
					color = d3color.color(scale(value));
				return [color.r, color.g, color.b, 255];
			},

			getElevation = ({ properties }) => {
				return heightScale(properties.height);
			};



    	const layers = [
	    	{
	    		id: 'ny-merge-layer-filled',
	    		data: this.props.geo['merge'][geoid.slice(0, 2)]['counties'],
	    		filled: true,
	    		stroked: false,
	    		getFillColor: [242, 239, 233, 255],
		      	pickable: false
	    	},
    		{ id: 'score-layer',
		      	data,
		      	getFillColor,
		      	filled: true,
		      	stroked: false,
		      	pickable: true,
		      	getElevation,
		      	elevationScale,
		      	extruded: threeD || transitioning,
		      	fp64: true,
		      	autoHighlight: true,
		      	highlightColor: [0, 0, 225, 255],
		      	wireframe: true,
		      	lightSettings: {
				  	lightsPosition: [-width, 0, 5000],
				  	ambientRatio: 0.4,
				  	diffuseRatio: 0.6,
				  	specularRatio: 0.8,
				  	lightsStrength: [2.5, 2.5],
				  	numberOfLights: 1
				},
				updateTriggers: {
					elevationScale: [elevationScale]
				},

  				transitions: {
    				getElevation: {
      					duration: 2500,
      					easing: easeCubic
    				}
  				},

		      	onHover: event => {
		      		const { object, x, y } = event;
		      		let hoverData = null;
		      		if (object) {
		      			const { score, height } = object.properties,
		      				{ hazard } = this.props;
		      			let heading = "Risk Index:";
		      			if (SOCIAL_SCORES.includes(hazard)) {
		      				heading = this.getHazardName(hazard);
		      			}
		      			hoverData = {
		      				rows: [
		      					[heading, format(score)]
		      				],
		      				x, y
		      			}
		      			if (threeD) {
		      				hoverData.rows.push([this.getHazardName(this.state.asHeight), format(height)]);
		      			}
		      		}
		      		this.setState({ hoverData });
		      	}
	    	},

	    	{
	    		id: 'ny-mesh-layer',
	    		data: this.props.geo['mesh'][geoid.slice(0, 2)]['counties'],
	    		filled: false,
	    		stroked: true,
	    		getLineColor: [200, 200, 200, 255],
		      	pickable: false
	    	},
	    	{
	    		id: 'ny-merge-layer-stroked',
	    		data: this.props.geo['merge'][geoid.slice(0, 2)]['counties'],
	    		filled: false,
	    		stroked: true,
	    		getLineColor: [242, 239, 233, 255],
	    		lineWidthMinPixels: 2,
		      	pickable: false
	    	},

	    	{
	    		id: 'critical-layer',
	    		data: criticalData,
	    		pointRadiusMinPixels: 3,
	    		stroked: true,
	    		getLineColor: [255, 0, 0, 255],
	    		filled: true,
	    		getFillColor: ({ properties }) => {
	    			const color = d3color.color(ftypeMap[properties.ftype].color);
	    			return [color.r, color.g, color.b, 255];
	    		},
	    		pickable: true,
		      	fp64: true,
		      	autoHighlight: true,
		      	highlightColor: [0, 225, 0, 255],
	    		onHover: event => {
	    			const { object, x, y } = event;
		      		let hoverData = null;
		      		if (object) {
		      			const { name, ftype } = object.properties;
		      			hoverData = {
		      				rows: [
			      				[name],
			      				["Type:", ftypeMap[ftype].name]
		      				], x, y
		      			}
		      		}
		      		this.setState({ hoverData });
	    		}
	    	}
	    ]
	    return { layers };
	}

  	getHazardName(hazard) {
    	try {
      		return this.props.riskIndex.meta[hazard].name;
    	}
    	catch (e) {
      		return getHazardName(hazard)
    	}
  	}

	generateLegend() {
		const { scale } = this.state,
			{ hazard } = this.props,
			name = this.getHazardName(hazard),
			range = scale.range(),
  			width = `${ 100 / range.length }%`;
		return (
			<table className="map-test-table">
				<thead>
					<tr>
						<th className="no-border-bottom" colSpan={ range.length }>
							Risk Index: { name }
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						{
							range.map(t => <td key={ t } style={ { width, height: '10px', background: t } }/>)
						}
					</tr>
					<tr>
						{
							range.map(t => <td key={ t } style={ { width } }>{ +(scale.invertExtent(t)[0] || 0).toFixed(2) }</td>)
						}
					</tr>
				</tbody>
			</table>
		)
	}
	generateHeightToggle() {
		return (
			<table className="map-test-table">
				<thead>
					<tr>
						<th className="no-border-bottom">
							<button className="map-test-button"
								onClick={ this.toggleAsHeight.bind(this) }>
								Height: { this.getHazardName(this.state.asHeight) }
							</button>
						</th>
					</tr>
				</thead>
			</table>
		)
	}
	generateThreeDtoggle() {
		return (
			<table className="map-test-table">
				<thead>
					<tr>
						<th className="no-border-bottom">
							<button className="map-test-button"
								onClick={ this.toggleThreeD.bind(this) }>
								3-D: { this.state.threeD ? "On" : "Off" }
							</button>
						</th>
					</tr>
				</thead>
			</table>
		)
	}
	generateFtypeLegend() {
		return (
			<table className="map-test-table">
				<thead>
					<tr>
						<th colSpan={ 2 }>
							Type Legend
						</th>
					</tr>
				</thead>
				<tbody>
					{
						Object.keys(ftypeMap).map(key =>
							<tr>
								<td>
									<div style={ {
											width: "16px", height: "16px",
											borderRadius: "8px",
											backgroundColor: ftypeMap[key].color
										} }/>
								</td>
								<td>
									{ ftypeMap[key].name }
								</td>
							</tr>
						)
					}
				</tbody>
			</table>
		)
	}
	generateControls() {
		const controls = [];

		controls.push({
			pos: "top-left",
			comp: this.generateLegend()
		})
		if (this.state.threeD) {
			controls.push({
				pos: "top-right",
				comp: this.generateHeightToggle()
			})
		}
		controls.push({
			pos: "bottom-left",
			comp: this.generateThreeDtoggle()
		})
		if (this.props.highRisk > 0.0) {
			controls.push({
				pos: "bottom-right",
				comp: this.generateFtypeLegend()
			})
		}

		return controls;
	}

  	render () {
  		const { layers } = this.generateLayers(),
  			{
  				threeD,
  				hoverData,
  				viewport
  			} = this.state,
  			{
  				interactive,
  				showBaseMap,
  				height
  			} = this.props;
    	return (
    		<MapTest layers={ layers }
    			height={ height }
    			hoverData={ hoverData }
	        	viewport={ viewport }
	        	controls={ this.generateControls() }
				dragPan={ interactive }
				scrollZoom={ interactive }
				dragRotate={ interactive }
				mapStyle={ showBaseMap ? undefined : "" }/>
    	) 
  	}
}

HazardMap.defaultProps = {
	height: 800,
	geoid: '36',
	geoLevel: "tracts",
	hazard: "riverine",
	threeD: true,
	interactive: false,
	showBaseMap: false,
	highRisk: 0.0
}

const mapStateToProps = state => ({
  	router: state.router,
  	riskIndex: state.graph.riskIndex,
  	geo: state.geo,
  	geoGraph: state.graph.geo,
  	critical: state.graph.critical
})

const mapDispatchToProps = {
	getChildGeo,
	getGeoMerge,
	getGeoMesh
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HazardMap));