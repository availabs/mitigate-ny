import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import get from "lodash.get";

import {
	getChildGeo,
	getGeoMerge,
	getGeoMesh
} from 'store/modules/geo'

import * as d3scale from 'd3-scale'
import * as d3color from 'd3-color'
import * as d3format from "d3-format"


import DeckMap from "components/mapping/escmap/DeckMap.react"
import Viewport from "components/mapping/escmap/Viewport"

const format = d3format.format(",d")

class HazardMap extends React.Component {

	state = {
		hoverData: null,
		viewport: Viewport(),
		dataProcessed: false,
		scale: d3scale.scaleQuantize()
			.domain([0, 100])
			.range(["#f2efe9", "#fadaa6", "#f7c475", "#f09a10", "#cf4010"]),
		data: {
			type: "FeatureCollection",
			features: []
		}
	}

	componentWillMount() {
    	const { geoid, geoLevel } = this.props;
		this.props.getChildGeo(geoid, geoLevel);
		this.props.getGeoMerge('36', 'counties');
		this.props.getGeoMesh('36', 'counties');
	}

	componentWillReceiveProps(newProps) {
		this.state.viewport
			.fitGeojson(newProps.geo['merge']['36']['counties'], { padding: 20 })
			// .onViewportChange({ pitch: 45 });
		this.processData();
	}

	fetchFalcorDeps() {
    	const { geoid, geoLevel, hazard } = this.props;
		return this.props.falcor.get(
			["geo", geoid, geoLevel]
		)
		.then(response => {
			return response.json.geo[geoid][geoLevel]
		})
		.then(geoids => {
			return this.props.falcor.get(
				["riskIndex", geoids, hazard, "score"]
			)
		})
		.then(() => this.processData())
	}

	processData() {
		if (this.state.dataProcessed) return;

    	const { geoid, geoLevel, hazard } = this.props,

    		scale = d3scale.scaleQuantize()
    			.domain([0, 100])
    			.range(["#f2efe9", "#fadaa6", "#f7c475", "#f09a10", "#cf4010"]),

    		data = {
    			type: "FeatureCollection",
    			features: []
    		};

    	let min = Infinity,
    		max = -Infinity,

    		dataProcessed = true;

    	try {
    		const geoData = this.props.geo[geoid][geoLevel].features;
    		this.props.geoGraph[geoid][geoLevel].value.forEach(geoid => {
    			let score = +this.props.riskIndex[geoid][hazard].score;
    			if (score) {
    				const geom = geoData.reduce((a, c) => c.properties.geoid === geoid ? c : a, null)
					if (geom) {
						const feature = JSON.parse(JSON.stringify(geom))
						feature.properties.score = score;
						data.features.push(feature);
						min = Math.min(min, score);
						max = Math.max(max, score);
					}
    			}
    		})
    		scale.domain([min, max])
    	}
    	catch (e) {
// console.log("ERROR:",e)
			dataProcessed = false;
    	}
    	dataProcessed = Boolean(data.features.length);
    	this.setState({ scale, data, dataProcessed });
	}

	generateLayers() {
		const { scale, data } = this.state,

			getFillColor = ({ properties }) => {
				const value = get(properties, `score`, 0),
					color = d3color.color(scale(value));
				return [color.r, color.g, color.b, 255];
			}

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
		      	key: ({ properties }) => properties.geoid,

		      	// onClick: (event => {
		      	// 	const { object } = event;
		      	// 	if (object) {
		      	// 		const geoid = object.properties.geoid;
		      	// 		this.props.setGeoid(geoid);
		      	// 	}
		      	// }).bind(this),

		      	onHover: (event => {
		      		const { object, x, y } = event;
		      		let hoverData = null;
		      		if (object) {
		      			const score = object.properties.score || 0;
		      			hoverData = {
		      				rows: [
		      					['Score', score]
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

	generateLegend() {
		const { scale } = this.state,
			range = scale.range(),
  			width = `${ 100 / range.length }%`;
		return (
			<table className="map-test-table">
				<thead>
					<tr>
						<th className="no-border-bottom" colSpan={ range.length }>
							Risk Index
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
							range.map(t => <td key={ t } style={ { width } }>{ format(scale.invertExtent(t)[0] || 0) }</td>)
						}
					</tr>
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

		return controls;
	}

  	render () {
  		const { layers } = this.generateLayers();
    	return (
    		<DeckMap layers={ layers }
    			height={ this.props.height }
    			hoverData={ this.state.hoverData }
	        	viewport={ this.state.viewport }
	        	controls={ this.generateControls() }/>
    	) 
  	}
}

HazardMap.defaultProps = {
	height: 800,
	geoid: '36',
	geoLevel: "tracts",
	hazard: "riverine"
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