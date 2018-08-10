import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import { setCurrrentPopulationYear } from 'store/modules/vulnerabilities'

import * as d3scale from 'd3-scale'
import * as d3color from 'd3-color'
import * as d3format from "d3-format"

import ElementBox from 'components/light-admin/containers/ElementBox'

import MapTest from "components/mapping/escmap/MapTest.react"

import {
	EARLIEST_YEAR,
	LATEST_YEAR
} from "./yearsOfSbaLoanData";

const format = d3format.format(",d")

class SbaChoropleth extends React.Component {
	state = {
		hoverData: null,
		currentYear: LATEST_YEAR
	}

	incrementCurrentYear() {
		const currentYear = Math.min(LATEST_YEAR, this.state.currentYear + 1);
		this.setState({ currentYear });
	}
	decrementCurrentYear() {
		const currentYear = Math.max(EARLIEST_YEAR, this.state.currentYear - 1);
		this.setState({ currentYear });
	}

	processData() {
		const { currentYear } = this.state;

		const data = {
			type: "FeatureCollection",
			features: []
		}

		const scale = d3scale.scaleLinear()
				.domain([0, 4])
				.range(["#ffffff", "#0000ff"]);
		const getFillColor = ({ properties }) => {
			return [0, 0, 0, 125];
		}
		const updateTriggers ={
			getFillColor: [currentYear]
		}
		return { scale, getFillColor, updateTriggers, data };
	}

	generateLayer() {
		const { currentYear } = this.state;
    	return { id: 'ny-counties',
		      	...this.processData(),
		      	onClick: (event => {
		      		const { object } = event;
		      		// if (object) {
		      		// 	const geoid = object.properties.geoid;
		      		// 	this.props.setGeoid(geoid);
		      		// }
		      	}).bind(this),
		      	onHover: (event => {
		      		const { object, x, y } = event;
		      		let hoverData = null;
		      		if (object) {
		      			// const population = object.properties.populations[currentYear] || 0;
		      			// hoverData = {
		      			// 	rows: [
		      			// 		[object.properties.name],
		      			// 		['Population', format(population)]
		      			// 	],
		      			// 	x, y
		      			// }
		      		}
		      		this.setState({ hoverData });
		      	}).bind(this)
	    	}
	}

	generatePopulationLegend(scale) {
  		const ticks = scale.ticks(5),
  			width = `${ 100 / ticks.length }%`;
		return (	
			<table className="map-test-table">
				<thead>
					<tr>
						<th className="no-border-bottom" colSpan={ ticks.length }>Population Legend</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						{
							ticks.map(t => <td key={ t } style={ { width, height: '10px', background: scale(t) } }/>)
						}
					</tr>
					<tr>
						{
							ticks.map(t => <td key={ t } style={ { width } }>{ format(t) }</td>)
						}
					</tr>
				</tbody>
			</table>
		)
	}
	generateMapNavigator() {
  		const { currentYear } = this.state,
  			decDisabled = (currentYear == EARLIEST_YEAR),
  			incDisabled = (currentYear == LATEST_YEAR);
		return (	
			<table className="map-test-table" style={ { tableLayout: "fixed" } }>
				<tbody>
					<tr className="no-border-bottom">
						<th style={ { textAlign: "center", width: "30%" } }>
							<button className="map-test-button"
								onClick={ this.decrementCurrentYear.bind(this) }
								disabled={ decDisabled }>
								{ "<" }
							</button>
						</th>
						<th style={ { textAlign: "center", width: "40%" } }>
							{ currentYear }
						</th>
						<th style={ { textAlign: "center", width: "30%" } }>
							<button className="map-test-button"
								onClick={ this.incrementCurrentYear.bind(this) }
								disabled={ incDisabled }>
								{ ">" }
							</button>
						</th>
					</tr>
				</tbody>
			</table>
		)
	}
	generateMapControls(scale) {
		return [
			{ pos: "top-right",
				comp: this.generatePopulationLegend(scale)
			},
			{ pos: "top-left",
				comp: this.generateMapNavigator()
			}
		]
	}

  	render () {
  		const { scale, ...layer } = this.generateLayer();
    	return (
	        <MapTest layers={ [layer] }
	        	viewport={ this.props.viewport }
	        	hoverData={ this.state.hoverData }
	        	controls={ this.generateMapControls(scale) }/>
    	) 
  	}
}

const mapStateToProps = state => ({
  	router: state.router,
    geo: state.geo,
    vulnerabilities: state.vulnerabilities,
    geoGraph: state.graph.geo
})

const mapDispatchToProps = {
  setCurrrentPopulationYear
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(SbaChoropleth));