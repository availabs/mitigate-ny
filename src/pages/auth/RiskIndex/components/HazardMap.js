import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import get from "lodash.get";

import {
  getHazardName
} from 'utils/sheldusUtils'

import {
	getChildGeo,
	getGeoMerge,
	getGeoMesh
} from 'store/modules/geo'

import * as d3scale from 'd3-scale'
import * as d3color from 'd3-color'
import * as d3format from "d3-format"


import DeckMap from "components/mapping/escmap/DeckMap.react"
import MapTest from "components/mapping/escmap/MapTest.react"
import Viewport from "components/mapping/escmap/Viewport"

const format = d3format.format(".2f")

class HazardMap extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			hoverData: null,
			viewport: Viewport(),
			scale: d3scale.scaleQuantize()
				.domain([0, 100])
				.range(["#f2efe9", "#fadaa6", "#f7c475", "#f09a10", "#cf4010"]),
			heightScale: d3scale.scaleLinear()
				.range([0, 100000]),
			data: {
				type: "FeatureCollection",
				features: []
			},
			asHeight: 'sovi',
			threeD: props.threeD
		}
	}

	componentWillMount() {
		this.props.getChildGeo('36', 'tracts');
		this.props.getChildGeo('36', 'counties');
		this.props.getGeoMerge('36', 'counties');
		this.props.getGeoMesh('36', 'counties');
	}

	componentWillReceiveProps(newProps) {
		const { geoid } = this.props;
		if (geoid.length === 5) {
			const counties = newProps.geo['36']['counties'].features,
				geo = counties.reduce((a, c) => c.properties.geoid === geoid ? c : a, null);
			if (geo) {
				this.state.viewport
					.fitGeojson(geo, { padding: 20 })
					.onViewportChange({ pitch: 45 });
			}
		}
		else {
			this.state.viewport
				.fitGeojson(newProps.geo['merge']['36']['counties'], { padding: 20 });
			if (this.props.threeD) {
				this.state.viewport.onViewportChange({ pitch: 45 });
			}
		}

		if (newProps.hazard !== this.props.hazard) {
			this.fetchFalcorDeps(newProps);
			this.processData(this.state.asHeight, newProps)
		}
	}

	fetchFalcorDeps({ geoid, geoLevel, hazard } = this.props) {
		return this.props.falcor.get(
			["geo", geoid, geoLevel],
			["riskIndex", "hazards"]
		)
		.then(response => {
			const hazards = response.json.riskIndex.hazards;
			return this.props.falcor.get(
				["riskIndex", "meta", hazards, "name"]
			)
			.then(() => response.json.geo[geoid][geoLevel]);
		})
		.then(geoids => {
// console.log("geoids:",geoids)
//`riskIndex[{keys:geoids}]['nri','bric','sovi','sovist']['score']`
			return this.props.falcor.get(
				["riskIndex", geoids, [hazard, 'sovi', 'builtenv'], 'score']
			)
		})
		.then(() => this.processData())
	}

	toggleAsHeight() {
		const asHeight = this.state.asHeight === 'builtenv' ? 'sovi' : 'builtenv';
		this.processData(asHeight);
	}
	toggleThreeD() {
		const threeD = !this.state.threeD;
		this.setState({ threeD });
	}

	processData(asHeight=this.state.asHeight, { geoid, geoLevel, hazard } = this.props) {

    	const scale = d3scale.scaleQuantize()
    			.domain([0, 100])
    			.range(["#f2efe9", "#fadaa6", "#f7c475", "#f09a10", "#cf4010"]),

    		heightScale = d3scale.scaleLinear()
    			.domain([0, 100])
				.range([0, 50000]),

    		data = {
    			type: "FeatureCollection",
    			features: []
    		};

    	let min = Infinity,
    		max = -Infinity,

    		minHeight = Infinity,
    		maxHeight = -Infinity;

    	try {
    		const geoData = this.props.geo['36'][geoLevel].features;
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

						const heightValue = this.props.riskIndex[geoid][asHeight].score;
						if (heightValue > 0) {
							feature.properties.height = heightValue;
							minHeight = Math.min(minHeight, heightValue);
							maxHeight = Math.max(maxHeight, heightValue);
						}
					}
    			}
    		})
    		// scale.domain([min, max]);
    		heightScale.domain([minHeight , maxHeight]);
    	}
    	catch (e) {
// console.log("ERROR:",e)
    	}
    	this.setState({ scale, heightScale, data, asHeight });
	}

	generateLayers() {
		const { scale, heightScale, data, viewport } = this.state,

			getFillColor = ({ properties }) => {
				const value = get(properties, `score`, 0),
					color = d3color.color(scale(value));
				return [color.r, color.g, color.b, 255];
			},
			getElevation = ({ properties }) => {
				return heightScale(properties.height);
			},

			{ width, height } = viewport(),

  			{
  				threeD,
  				interactiveMap,
  				showBaseMap
  			} = this.props;

    	const layers = [
	    	{
	    		id: 'ny-merge-layer-filled',
	    		data: this.props.geo['merge']['36']['counties'],
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
		      	extruded: threeD,
		      	fp64: true,
		      	autoHighlight: true,
		      	highlightColor: [0, 0, 225, 255],
		      	wireframe: threeD,
		      	lightSettings: {
				  	lightsPosition: [-width, 0, 5000],
				  	ambientRatio: 0.4,
				  	diffuseRatio: 0.6,
				  	specularRatio: 0.8,
				  	lightsStrength: [2.5, 2.5],
				  	numberOfLights: 1
				},

		      	onHover: (event => {
		      		const { object, x, y } = event;
		      		let hoverData = null;
		      		if (object) {
		      			const score = object.properties.score,
		      				height = object.properties.height;
		      			hoverData = {
		      				rows: [
		      					[this.props.hazard, format(score)],
		      					[this.state.asHeight, format(height)]
		      				],
		      				x, y
		      			}
		      		}
		      		this.setState({ hoverData });
		      	}).bind(this)
	    	},
	    	{
	    		id: 'ny-mesh-layer',
	    		data: this.props.geo['mesh']['36']['counties'],
	    		filled: false,
	    		stroked: true,
	    		getLineColor: [200, 200, 200, 255],
		      	pickable: false
	    	},
	    	{
	    		id: 'ny-merge-layer-stroked',
	    		data: this.props.geo['merge']['36']['counties'],
	    		filled: false,
	    		stroked: true,
	    		getLineColor: [242, 239, 233, 255],
	    		lineWidthMinPixels: 2,
		      	pickable: false
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
							range.map(t => <td key={ t } style={ { width } }>{ Math.round(scale.invertExtent(t)[0] || 0) }</td>)
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
								Height: { this.state.asHeight }
							</button>
						</th>
					</tr>
				</thead>
			</table>
		)
	}
	generateControls() {
		const controls = [];

		controls.push({
			pos: "top-left",
			comp: this.generateLegend()
		})
		controls.push({
			pos: "top-right",
			comp: this.generateHeightToggle()
		})

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
  				interactiveMap,
  				showBaseMap,
  				height
  			} = this.props;
    	return (
    		<MapTest layers={ layers }
    			height={ height }
    			hoverData={ hoverData }
	        	viewport={ viewport }
	        	controls={ this.generateControls() }
				dragPan={ interactiveMap }
				scrollZoom={ interactiveMap }
				dragRotate={ interactiveMap }
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
	interactiveMap: false,
	showBaseMap: false
}

const mapStateToProps = state => ({
  	router: state.router,
  	riskIndex: state.graph.riskIndex,
  	geo: state.geo,
  	geoGraph: state.graph.geo
})

const mapDispatchToProps = {
	getChildGeo,
	getGeoMerge,
	getGeoMesh
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HazardMap));