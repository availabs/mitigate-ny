import React from 'react';
import { connect } from 'react-redux';

import { ResponsiveBar } from "@nivo/bar"

import * as d3color from "d3-color"
import * as d3scale from "d3-scale"

import ElementBox from 'components/light-admin/containers/ElementBox'

import {
	processDataForBarChart,
	processSheldus5year,
	sumData,
	avgData
} from 'utils/sheldusUtils'

const D3_CATEGORY20 = [
	"#1f77b4",
	"#aec7e8",
	"#ff7f0e",
	"#ffbb78",
	"#2ca02c",
	"#98df8a",
	"#d62728",
	"#ff9896",
	"#9467bd",
	"#c5b0d5",
	"#8c564b",
	"#c49c94",
	"#e377c2",
	"#f7b6d2",
	"#7f7f7f",
	"#c7c7c7",
	"#bcbd22",
	"#dbdb8d",
	"#17becf",
	"#9edae5"
];

const COLOR_SCALE = d3scale.scaleOrdinal()
		.range(D3_CATEGORY20);

class GeographyScoreBarChart extends React.Component {

	processData() {
    	const { geoid, geoLevel, dataType } = this.props;
		try {
			const geoids = this.props.geoGraph[geoid][geoLevel].value
			return processDataForBarChart(this.props[dataType], geoids);
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
		COLOR_SCALE.domain(keys);
		return (
			<ElementBox>
				<div style={ { height: "500px" } }>
					<ResponsiveBar
						data={ data }
						keys={ keys }
						indexBy="year"
						colorBy={ d => COLOR_SCALE(d.id) }
						enableLabel={ false }
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