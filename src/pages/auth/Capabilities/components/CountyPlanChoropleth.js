import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import { push } from "react-router-redux"

import { history } from "store"

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
					.domain([0.0, 1.0, 2.0, 3.0])
					.range(["#999", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"]),
		statusScale: d3scale.scaleThreshold()
					.domain([1, 10, 11])
					.range(["#d73027", "#f46d43", "#fdae61", "#999"]),
		viewport: Viewport(),
		hoverData: null,
		dataProcessed: false
	}//["#ffeda0","#feb24c","#f03b20"]
	//["#ffffcc","#c2e699","#78c679","#31a354","#006837"]
	//["#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850"]

	componentWillMount() {
		this.props.getChildGeo('36', 'counties');
		this.props.getGeoMerge('36', 'counties');
		this.props.getGeoMesh('36', 'counties');
	}

	componentDidMount() {
		this.state.viewport.register(this, this.forceUpdate, false);
	}
	componentWillnmount() {
		this.state.viewport.unregister(this);
	}

	componentWillReceiveProps(newProps) {
		this.state.viewport.fitGeojson(newProps.geo['merge']['36']['counties'], { padding: 20 });
		if (!this.state.dataProcessed) {
			this.processData(newProps)
		}
	}

	fetchFalcorDeps() {
		return this.props.falcor.get(
			["geo", '36', 'counties']
		)
		.then(response => response.json.geo['36'].counties)
		.then(geoids => {
			return this.props.falcor.get(
				['geo', geoids, 'name'],
				['counties', 'byFips', geoids, ['plan_status', 'plan_expiration', 'plan_url']]
			)
		})
		.then(() => this.processData())
	}

	processData(props=this.props) {
		try {
			const scale = this.state.scale,

				geoids = props.geoGraph['36']['counties'].value,

				data = {
					type: "FeatureCollection",
					features: []
				},

				now = new Date(),

				millisecondsPerYear = 1000 * 60 * 60 * 24 * 365;

			let ny_city_plan = {
					time: null,
					exp: null,
					consultant: null
				},
				ny_city_features = [];

			props.geo['36']['counties'].features.forEach(feature => {
				const { properties, geometry } = feature,
					geoid = properties.geoid,
					name = props.geoGraph[geoid].name,
					graph = props.counties.byFips[geoid],
					exp = new Date(graph["plan_expiration"]),

					time = (exp.valueOf() - now.valueOf()) / millisecondsPerYear,

					newFeature = {
						type: "Feature",
						properties: {
							geoid,
							name,
							time,
							exp: graph.plan_expiration,
							consultant: graph.plan_consultant,
							status: graph.plan_status
						},
						geometry
					};

				if (geoid === "36061") {
					ny_city_plan = {
						time,
						exp: graph.plan_expiration,
						consultant: graph.plan_consultant
					};
				}
				if (["36005", "36047", "36081", "36085"].includes(geoid)) {
					ny_city_features.push(newFeature);
				}
				else {
					data.features.push(newFeature)
				}
			})
			ny_city_features.forEach(feature => {
				const { properties, geometry } = feature,

					newFeature = {
						type: "Feature",
						properties: {
							...properties,
							...ny_city_plan
						},
						geometry
					};
				data.features.push(newFeature)
			})
			this.setState({ data, dataProcessed: Boolean(data.features.length) })
		}
		catch (e) {

		}
	}

	generateLayers() {
		const { scale, data, statusScale } = this.state,

			getFillColor = ({ properties }) => {
				const time = get(properties, `time`, 0),
					status = get(properties, 'status', 0);
				let color = d3color.color(scale(time));
				
				if (time < 0) {
					color = d3color.color(statusScale(status));
				}
				return [color.r, color.g, color.b, 255];
			},

			getStatusLabelstatusMap = (time, status) => {
				const current = time < 0 ? "Plan Expired" : "Plan Current";

				if ((status >= 1) && (status <= 9)) return `${ current }: Update in Progress`;
				if (status === 10) return `${ current }: Approvable Pending Adoption`;

				return current;
			}

  	const layers = [
    	{
    		id: 'counties-layer',
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
		      				exp,
		      				consultant,
		      				status,
		      				time
		      			} = object.properties,
		      			rows = [
		      				[name],
		      				['Status', `(${status}) ${ getStatusLabelstatusMap(time, status) }`],
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
	      	},
	      	onClick: event => {
	      		const { object, x, y } = event;
	      		if (object) {
	      			const { geoid } = object.properties;
	      			// this.props.push(`/m/${ geoid }`)
	      			document.location.href = `/m/${ geoid }`
	      		}
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

	generateLegend({ scale, statusScale }=this.state) {
  		const range = scale.range(),
  			statusRange = statusScale.range(),
  			width = `${ 100 / range.length }%`,
  			domainValues = range.map(r => scale.invertExtent(r)[0]);
  		if (!domainValues.reduce((a, c) => a || Boolean(c), false)) return false;

  		const statusScaleMap = {
  			 "0":"No Current Plan or Grant",
			 "1":"Update in Progress",
			 "2":"Update in Progress",
			 "3":"Update in Progress",
			 "4":"Update in Progress",
			 "5":"Update in Progress",
			 "6":"Update in Progress",
			 "7":"Update in Progress",
			 "8":"Update in Progress",
			 "9":"Update in Progress",
			 "10":"Approvable Pending Adoption",
			 "11":"Approvable Pending Adoption",
			 "12":"Plan Current",
			 "13":"Plan Current",
			 "14":"Plan Current",
			 "15":"Plan Current"
  		}

		return (	
			<table className="map-test-table" style={{width:"auto"}}>
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
					<tr>
						<th className="no-border-bottom" colSpan={ statusRange.length }>Status&nbsp;Codes</th>
					</tr>
					<tr>
						{
							statusRange.map(t => <td key={ t } style={ { width, height: '10px', background: t } }/>)
						}
					</tr>
					<tr>
						{
							statusRange.map(t => <td key={ t } style={ { width } }>{ statusScaleMap[statusScale.invertExtent(t)[0]] }</td>)
						}
					</tr>
				</tbody>
			</table>
		)
	}

// //
	generateMapControls() {
		const controls = [{
			pos: 'bottom-left',
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
	getGeoMesh,
	push
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CountyPlanChoropleth));
