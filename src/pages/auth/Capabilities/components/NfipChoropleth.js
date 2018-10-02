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

const formats = {
	num_losses: d => d,
	total_loss: d3format.format("$,d")
}

class CountyPlanChoropleth extends React.Component {

	state = {
		data: {
			type: "FeatureCollection",
			features: []
		},
		scale: d3scale.scaleQuantile()
					.range(["#f2efe9", "#fadaa6", "#f7c475", "#f09a10", "#cf4010"]),
		viewport: Viewport(),
		hoverData: null,
		dataProcessed: false
	}

	componentWillMount({ geoLevel }=this.props) {
		this.props.getChildGeo('36', geoLevel);
		this.props.getGeoMerge('36', geoLevel);
		this.props.getGeoMesh('36', geoLevel);
	}

	componentDidMount() {
		this.state.viewport.register(this, this.forceUpdate, false);
	}
	componentWillnmount() {
		this.state.viewport.unregister(this);
	}

	componentWillReceiveProps(newProps) {
		this.state.viewport.fitGeojson(newProps.geo['merge']['36'][newProps.geoLevel], { padding: 20 });
		if (!this.state.dataProcessed) {
			this.processData(newProps)
		}
	}

	fetchFalcorDeps({ geoid, geoLevel, attribute }=this.props) {
		return this.props.falcor.get(
			["geo", geoid, geoLevel]
		)
		.then(response => response.json.geo[geoid][geoLevel])
		.then(geoids => {
			return this.props.falcor.get(
				['nfip', 'byGeoid', geoids, 'allTime', attribute]
			)
			.then(() => {
				return this.props.falcor.get(
					['geo', geoids, 'name']
				)
			});
		})
		.then(() => this.processData())
	}

	processData(props=this.props) {
		try {

			const { geoid, geoLevel, attribute } = props,

				data = {
					type: "FeatureCollection",
					features: []
				},

				domain = [];

			let scale = d3scale.scaleThreshold()
					.domain([5, 25, 100, 250])
					.range(["#f2efe9", "#fadaa6", "#f7c475", "#f09a10", "#cf4010"]);

			if (attribute === 'total_loss') {
				scale = d3scale.scaleQuantile()
					.range(["#f2efe9", "#fadaa6", "#f7c475", "#f09a10", "#cf4010"]);
			}
			if ((attribute === 'num_losses') && (geoLevel === 'counties')) {
				scale.domain([25, 50, 200, 500])
			}

			props.geo['36'][geoLevel].features.forEach(feature => {
				const { properties, geometry } = feature,
					geoid = properties.geoid,
					name = props.geoGraph[geoid].name,
					d = props.nfip.byGeoid[geoid].allTime[attribute];

				if (d > 0) {
					domain.push(d);
				}

				data.features.push({
					type: "Feature",
					properties: {
						geoid,
						name,
						data: d
					},
					geometry
				})

			})

			if (attribute === 'total_loss') {
				scale.domain(domain);
			}

			this.setState({ data, scale, dataProcessed: Boolean(data.features.length) })
		}
		catch (e) {
// console.log("ERROR:",e)
		}
	}

	generateLayers() {
		const { geoid, geoLevel, attribute } = this.props,
			{ scale, data } = this.state,

			getFillColor = ({ properties }) => {
				const data = get(properties, `data`, 0),
					color = d3color.color(scale(data));
				return [color.r, color.g, color.b, 255];
			}

    	const layers = [
	    	{
	    		id: 'ny-merge-layer-filled',
	    		data: this.props.geo['merge']['36'][geoLevel],
	    		filled: true,
	    		stroked: false,
	    		getFillColor: [242, 239, 233, 255],
		      	pickable: false
	    	},
	    	{
	    		id: 'choropleth-layer',
	    		data,
	    		filled: true,
	    		stroked: false,
	    		getFillColor,
	    		pickable: true,
	    		autoHighlight: true,
	    		highlightColor: [200, 200, 200, 255],

		      	onHover: event => {
		      		const { object, x, y } = event;
		      		let hoverData = null;
		      		if (object) {
		      			const {
		      					geoid,
			      				name,
			      				data
			      			} = object.properties,
			      			rows = [
			      				[name],
			      				['geoid', geoid],
			      				[attribute.replace("_", " "), formats[attribute](data)]
			      			];
		      			hoverData = {
		      				rows, x, y
		      			}
		      		}
		      		this.setState({ hoverData });
		      	}
	    	},
	    	{
	    		id: 'ny-mesh-layer',
	    		data: geoLevel === 'counties' ? this.props.geo['mesh']['36'][geoLevel] : [],
	    		filled: false,
	    		stroked: true,
	    		getLineColor: [200, 200, 200, 255],
		      	pickable: false
	    	},
	    	{
	    		id: 'ny-merge-layer-stroked',
	    		data: this.props.geo['merge']['36'][geoLevel],
	    		filled: false,
	    		stroked: true,
	    		getLineColor: [255, 255, 255, 255],
	    		lineWidthMinPixels: 2,
		      	pickable: false
	    	}
	    ]
	    return { scale, layers };
	}

	generateLegend(scale=this.state.scale, { attribute }=this.props) {
  		const range = scale.range(),
  			width = `${ 100 / range.length }%`,
  			domainValues = range.map(r => scale.invertExtent(r)[0]);
  		if (!domainValues.reduce((a, c) => a || Boolean(c), false)) return false;
  		const label = attribute.split("_").map(d => d.split("").map((c, i) => i === 0 ? c.toUpperCase() : c).join("")).join(" ")
		return (	
			<table className="map-test-table">
				<thead>
					<tr>
						<th className="no-border-bottom" colSpan={ range.length }>{ label }</th>
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
							range.map(t => <td key={ t } style={ { width } }>{ formats[attribute](scale.invertExtent(t)[0]) }</td>)
						}
					</tr>
				</tbody>
			</table>
		)
	}

// //
	generateMapControls() {
		const controls = [{
			pos: 'top-left',
			comp: this.generateLegend()
		}];
		return controls;
	}

// //
  	render () {
  		const { layers } = this.generateLayers();
    	return (
    		<DeckMap layers={ layers }
    			height={ this.props.height }
    			hoverData={ this.state.hoverData }
	        	viewport={ this.state.viewport }
	        	controls={ this.generateMapControls() }/>
    	) 
  	}
}

// //
CountyPlanChoropleth.defaultProps = {
	height: 800,
	geoid: '36',
	geoLevel: 'tracts',
	attribute: 'total_loss'
}

const mapStateToProps = state => ({
  	router: state.router,
    geo: state.geo,
    geoGraph: state.graph.geo,
    nfip: state.graph.nfip
})

const mapDispatchToProps = {
	getChildGeo,
	getGeoMerge,
	getGeoMesh
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CountyPlanChoropleth));