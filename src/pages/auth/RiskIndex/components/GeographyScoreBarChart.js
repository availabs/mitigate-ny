import React from 'react';
import { connect } from 'react-redux';

import { ResponsiveBar } from "@nivo/bar"

import * as d3color from "d3-color"

import ElementBox from 'components/light-admin/containers/ElementBox'

import {
	processDataForBarChart,
	processSheldus5year,
	sumData,
	avgData
} from 'utils/sheldusUtils'

class GeographyScoreBarChart extends React.Component {

	processData() {
    	const { geoid, geoLevel, dataType } = this.props;
		// 	data = {},
		// 	keys = {};
		// try {
  //     		this.props.geoGraph[geoid][geoLevel].value
  //       		.forEach((geoLevelid, i) => {
  //         			this.props.riskIndexGraph.hazards.value
  //           			.filter(hazard => ['tsunami', 'avalanche', 'volcano'].indexOf(hazard) === -1)
  //           			.forEach(hazard => {
  //             				const column = `${ hazard.toUpperCase() } LOSS`,
		// 	              		processedSheldus = processSheldus5year(this.props[dataType][geoLevelid][hazard], 'property_damage', 'total');
		// 	              	keys[column] = true;
		// 					for (const year in processedSheldus) {
		// 						if (!(year in data)) {
		// 							data[year] = { year };
		// 						}
		// 						if (!(column in data[year])) {
		// 							data[year][column] = 0;
		// 						}
		// 						let value = data[year][column];
		// 						value += Math.round(processedSheldus[year] / 1000);
		// 						data[year][column] = value;
		// 					}
  //         				})
  //       		});
		// }
		// catch (e) {}
		// return { data: Object.values(data), keys: Object.keys(keys) }

		try {
			return processDataForBarChart(this.props[dataType], geoid);
		}
		catch (e) {
			return { data: [], keys: [] }
		}
	}
	render() {
		const { data, keys } = this.processData();
		if (!data.length) {
			return <ElementBox>Loading...</ElementBox>;
		}
		return (
			<ElementBox>
				<div style={ { height: "500px" } }>
					<ResponsiveBar
						data={ data }
						keys={ keys }
						indexBy="year"
						colors={ 'd320' }
						enableLabel={ false }
						// labelSkipHeight={ 15 }
						// labelFormat="$,d"
						tooltipFormat="$,d"
						margin={ {
				            "top": 25,
				            "right": 25,
				            "bottom": 50,
				            "left": 115
			        	} }
						axisBottom={ {
				            "orient": "bottom",
				            "tickSize": 5,
				            "tickPadding": 5,
				            "tickRotation": 0,
				            "legend": "Year",
				            "legendPosition": "center",
			            	"legendOffset": 40
			        	} }
				        axisLeft={ {
				            "orient": "left",
				            "tickSize": 5,
				            "tickPadding": 5,
				            "tickRotation": 0,
				            "legend": "Property Damage",
				            "legendPosition": "center",
				            "legendOffset": -90,
			            	"format":"$,d"
				        } }
				        theme={ {
				        	"axis": {
				        		"legendFontSize": "18px"
				        	}
				        } }
				        legends={ [
	            			// {
				            //     "dataFrom": "keys",
				            //     "anchor": "top-right",
				            //     "direction": "column",
				            //     "translateX": 120,
				            //     "itemWidth": 100,
				            //     "itemHeight": 20,
				            //     "itemsSpacing": 2,
				            //     "symbolSize": 20
				            // }
	        			] }/>
				</div>
	        </ElementBox>
		)
	}
}

const mapStateToProps = state => {
  return {
    riskIndexGraph: state.graph.riskIndex || {},
    sheldus: state.graph.sheldus || {},
    severeWeather: state.graph.severeWeather || {},
    geoGraph: state.graph.geo || {},
    riskIndex: state.riskIndex,
    router: state.router,
    geo: state.geo
  }
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GeographyScoreBarChart)