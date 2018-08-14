import React from 'react';
import { connect } from 'react-redux';

import { setCurrrentPopulationYear } from 'store/modules/vulnerabilities'

import * as d3scale from 'd3-scale'
import * as d3color from 'd3-color'
import * as d3format from "d3-format"

import ElementBox from 'components/light-admin/containers/ElementBox'

import MapTest from "components/mapping/escmap/MapTest.react"

import {
	EARLIEST_YEAR,
	LATEST_YEAR,
  	YEARS_OF_ACS_DATA
} from "./yearsOfAcsData";

const format = d3format.format(",d")

class PopulationsMap extends React.Component {
	state = {
		hoverData: null
	}

	incrementCurrentPopulationYear() {
		const { currentPopulationYear } = this.props.vulnerabilities;
		this.props.setCurrrentPopulationYear(Math.min(LATEST_YEAR, currentPopulationYear + 1));
	}
	decrementCurrentPopulationYear() {
		const { currentPopulationYear } = this.props.vulnerabilities;
		this.props.setCurrrentPopulationYear(Math.max(EARLIEST_YEAR, currentPopulationYear - 1));
	}

	processCounties() {
		const { currentPopulationYear } = this.props.vulnerabilities,
			{ geoLevel } = this.props,
			geoGraph = this.props.geoGraph || {},
			counties = this.props.geo['36'].counties,

			data = {
				type: "FeatureCollection",
				features: [],
				countiesPopScale: d3scale.scaleLinear(),
				tractsPopScale: d3scale.scaleLinear()
			};

		let minPopulation = Infinity,
			maxPopulation = -Infinity;

		counties.features.forEach(feature => {
			const geoid = feature.properties.geoid,
				newFeature = Object.assign({}, feature);
			newFeature.properties.populations = {};
			try {
				YEARS_OF_ACS_DATA.forEach(year => {
					const population = +geoGraph[geoid][year].population;
					newFeature.properties.populations[year] = population;
					if ((population !== 0) && (year === currentPopulationYear)) {
						minPopulation = Math.min(minPopulation, population);
						maxPopulation = Math.max(maxPopulation, population);
					}
				})
			}
			catch (e) {}
			data.features.push(newFeature);
		})
		const countiesPopScale = d3scale.scaleLinear()
				.domain([minPopulation, maxPopulation])
				.range(["#ffffff", "#ff0000"]);
		const getFillColor = ({ properties }) => {
			const population = properties.populations[currentPopulationYear],
				color = population && (geoLevel === 'counties') ? countiesPopScale(population) : "#000000",
				rgbColor = d3color.rgb(color);
			return [rgbColor.r, rgbColor.g, rgbColor.b, population && (geoLevel === 'counties') ? 255 : 175];
		}
		const updateTriggers = {
			getFillColor: [geoLevel, currentPopulationYear]
		}
		return { countiesPopScale, data, getFillColor, updateTriggers };
	}
	processTracts() {
		const { currentPopulationYear } = this.props.vulnerabilities,
			{ geoid, geoLevel } = this.props,
			GEOID = geoid,
			geoGraph = this.props.geoGraph || {},
			tracts = this.props.geo['36'].tracts,

			data = {
				type: "FeatureCollection",
				features: []
			};

		if (geoLevel !== 'tracts-cousubs') {
			return { data };
		}

		let minPopulation = Infinity,
			maxPopulation = -Infinity;

		tracts.features.forEach(feature => {
			if (!feature.properties.geoid.includes(GEOID)) return;
			const geoid = feature.properties.geoid,
				newFeature = Object.assign({}, feature);
			newFeature.properties.populations = {};
			try {
				YEARS_OF_ACS_DATA.forEach(year => {
					const population = +geoGraph[geoid][year].population;
					newFeature.properties.populations[year] = population;
					if ((population !== 0) && (year === currentPopulationYear)) {
						minPopulation = Math.min(minPopulation, population);
						maxPopulation = Math.max(maxPopulation, population);
					}
				})
			}
			catch (e) {}
			data.features.push(newFeature);
		})
		const tractsPopScale = d3scale.scaleLinear()
				.domain([minPopulation, maxPopulation])
				.range(["#ffffff", "#ff0000"]);
		const getFillColor = ({ properties }) => {
			const population = properties.populations[currentPopulationYear],
				color = population ? tractsPopScale(population) : "#000000",
				rgbColor = d3color.rgb(color);
			return [rgbColor.r, rgbColor.g, rgbColor.b, population ? 255 : 175];
		}
		const updateTriggers ={
			getFillColor: [GEOID, geoLevel, currentPopulationYear]
		}
		return { tractsPopScale, data, getFillColor, updateTriggers };
	}

	generateLayers() {
		const { currentPopulationYear } = this.props.vulnerabilities;
    	return [
	    	{ id: 'ny-counties',
		      	...this.processCounties(),
		      	onClick: (event => {
		      		const { object } = event;
		      		if (object) {
		      			const geoid = object.properties.geoid;
		      			this.props.setGeoid(geoid);
		      		}
		      	}).bind(this),
		      	onHover: (event => {
		      		const { object, x, y } = event;
		      		let hoverData = null;
		      		if (object) {
		      			const population = object.properties.populations[currentPopulationYear] || 0;
		      			hoverData = {
		      				rows: [
		      					[object.properties.name],
		      					['Population', format(population)]
		      				],
		      				x, y
		      			}
		      		}
		      		this.setState({ hoverData });
		      	}).bind(this)
	    	},
	    	{ id: 'ny-tracts',
		      	...this.processTracts(),
		      	onHover: (event => {
		      		const { object, x, y } = event;
		      		let hoverData = null;
		      		if (object) {
		      			const population = object.properties.populations[currentPopulationYear] || 0;
		      			hoverData = {
		      				rows: [
		      					['Population', format(population)]
		      				],
		      				x, y
		      			}
		      		}
		      		this.setState({ hoverData });
		      	}).bind(this)
	    	}
    	]
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
  		const { currentPopulationYear } = this.props.vulnerabilities,
  			decDisabled = (currentPopulationYear === EARLIEST_YEAR),
  			incDisabled = (currentPopulationYear === LATEST_YEAR);
		return (	
			<table className="map-test-table" style={ { tableLayout: "fixed" } }>
				<tbody>
					<tr>
						<th style={ { textAlign: "center", width: "30%" } }>
							<button className="map-test-button"
								onClick={ this.decrementCurrentPopulationYear.bind(this) }
								disabled={ decDisabled }>
								{ "<" }
							</button>
						</th>
						<th style={ { textAlign: "center", width: "40%" } }>
							{ currentPopulationYear }
						</th>
						<th style={ { textAlign: "center", width: "30%" } }>
							<button className="map-test-button"
								onClick={ this.incrementCurrentPopulationYear.bind(this) }
								disabled={ incDisabled }>
								{ ">" }
							</button>
						</th>
					</tr>
					<tr>
						<td colSpan="3">
							<button className="map-test-button"
								onClick={ () => this.props.setGeoid('36') }>
								Reset Map
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		)
	}
	generateMapControls(cScale, tScale) {
		const { geoLevel } = this.props;
		return [
			{ pos: "top-right",
				comp: this.generatePopulationLegend(geoLevel === "counties" ? cScale : tScale)
			},
			{ pos: "top-left",
				comp: this.generateMapNavigator()
			}
		]
	}

  	render () {
  		const [
  			{ countiesPopScale, ...countiesLayer },
  			{ tractsPopScale, ...tractsLayer }
  		] = this.generateLayers();
    	return (
      		<ElementBox>
		        <MapTest layers={ [countiesLayer, tractsLayer] }
		        	viewport={ this.props.viewport }
		        	hoverData={ this.state.hoverData }
		        	controls={ this.generateMapControls(countiesPopScale, tractsPopScale) }/>
      		</ElementBox>
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

export default connect(mapStateToProps, mapDispatchToProps)(PopulationsMap);