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

const format = d3format.format("$,d")

class CountyPlanChoropleth extends React.Component {

	state = {
		data: {
			type: "FeatureCollection",
			features: []
		},
		scale: d3scale.scaleThreshold()
					.domain([0.0, 1.0, 3.0])
					.range(["#666", "#fc8d59","#ffffbf","#91cf60"]),
		viewport: Viewport(),
		hoverData: null
	}

	componentWillMount() {
		this.props.getChildGeo('36', 'counties');
		this.props.getGeoMerge('36', 'counties');
		this.props.getGeoMesh('36', 'counties');

		this.processData();
	}

	componentWillReceiveProps(newProps) {
		this.state.viewport.fitGeojson(newProps.geo['merge']['36']['counties'], { padding: 20 });
	}

	fetchFalcorDeps() {
		return this.props.falcor.get(
			["geo", '36', 'counties']
		)
		.then(response => response.json.geo['36'].counties)
		.then(geoids => {
			return this.props.falcor.get(
				['geo', geoids, 'name'],
				['counties', 'byFips', geoids, ['plan_expiration', 'plan_consultant', 'plan_url']]
			)
		})
		.then(() => this.processData())
	}

	processData() {
		try {
			const scale = this.state.scale,

				geoids = this.props.geoGraph['36']['counties'].value,

				data = {
					type: "FeatureCollection",
					features: []
				},

				now = new Date(),

				millisecondsPerYear = 1000 * 60 * 60 * 24 * 365;

			this.props.geo['36']['counties'].features.forEach(feature => {
				const { properties, geometry } = feature,
					geoid = properties.geoid,
					name = this.props.geoGraph[geoid].name,
					graph = this.props.counties.byFips[geoid],
					exp = new Date(graph["plan_expiration"]),

					time = (exp.valueOf() - now.valueOf()) / millisecondsPerYear;

				data.features.push({
					type: "Feature",
					properties: {
						geoid,
						name,
						time,
						exp: graph.plan_expiration,
						consultant: graph.plan_consultant
					},
					geometry
				})
			})
			this.setState({ data })
		}
		catch (e) {

		}
	}

	generateLayers() {
		const { scale, data } = this.state,

			getFillColor = ({ properties }) => {
				const time = get(properties, `time`, 0),
					color = d3color.color(scale(time));
				return [color.r, color.g, color.b, 255];
			}

    	const layers = [
	    	{
	    		id: 'counties-layer',
	    		data,
	    		filled: true,
	    		stroked: false,
	    		getFillColor: getFillColor,
	    		pickable: true,
	    		autoHighlight: true,
	    		highlightColor: [200, 200, 200, 255],

		      	onHover: event => {
		      		const { object, x, y } = event;
		      		let hoverData = null;
		      		if (object) {
		      			const {
			      				name,
			      				exp,
			      				consultant
			      			} = object.properties,
			      			rows = [
			      				[name],
			      				['Expiration', exp || "No Date"]
			      			];
			      		if (consultant) {
			      			rows.push(['Consultant', consultant])
			      		}
		      			hoverData = {
		      				rows, x, y
		      			}
		      		}
		      		this.setState({ hoverData });
		      	}
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
	    		getLineColor: [255, 255, 255, 255],
	    		lineWidthMinPixels: 2,
		      	pickable: false
	    	}
	    ]
	    return { scale, layers };
	}

	generateLegend(scale=this.state.scale) {
  		const range = scale.range(),
  			width = `${ 100 / range.length }%`,
  			domainValues = range.map(r => scale.invertExtent(r)[0]);
  		if (!domainValues.reduce((a, c) => a || Boolean(c), false)) return false;
		return (	
			<table className="map-test-table">
				<thead>
					<tr>
						<th className="no-border-bottom" colSpan={ range.length }>Expiration&nbsp;Years</th>
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
							range.map(t => <td key={ t } style={ { width } }>{ scale.invertExtent(t)[0] }</td>)
						}
					</tr>
				</tbody>
			</table>
		)
	}

// ;
	generateMapControls() {
		const controls = [{
			pos: 'top-left',
			comp: this.generateLegend()
		}];
		return controls;
	}
// ;

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

// ;

CountyPlanChoropleth.defaultProps = {
	height: 800
}

const mapStateToProps = state => ({
  	router: state.router,
    geo: state.geo,
    geoGraph: state.graph.geo,
    counties: state.graph.counties
})

const mapDispatchToProps = {
	getChildGeo,
	getGeoMerge,
	getGeoMesh
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CountyPlanChoropleth));