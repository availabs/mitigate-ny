import React from 'react';
import { connect } from 'react-redux';

import { ResponsiveBar } from "@nivo/bar"

import * as d3color from "d3-color"
import * as d3format from "d3-format"
import * as d3scale from "d3-scale"

import ElementBox from 'components/light-admin/containers/ElementBox'

import {
	processDataForBarChart,
	getHazardName
} from 'utils/sheldusUtils'

const format = d3format.format("$,d");

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
		return (
			<ElementBox>
				<div style={ { height: "500px" } }>
					<ResponsiveBar
						data={ data }
						keys={ keys }
						indexBy="year"
						colorBy={ d => this.props.colorScale(d.id) }
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
				        tooltip={
				        	d => (
					        	<div>
					        		<div style={ { display: "inline-block", width: "15px", height: "15px", backgroundColor: this.props.colorScale(d.id) } }/>
					        		<span style={ { paddingLeft: "5px" } }>{ getHazardName(d.id) }</span>
					        		<span style={ { paddingLeft: "5px" } }>{ format(d.value) }</span>
					        	</div>
					        )
				        }
				        theme={ {
				        	"axis": {
				        		"legendFontSize": "18px"
				        	}
				        } }/>
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