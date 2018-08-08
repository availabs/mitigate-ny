import React from 'react';
import { connect } from 'react-redux';

import get from "lodash.get"

import { ResponsiveBar } from "@nivo/bar"

import * as d3color from "d3-color"
import * as d3format from "d3-format"
import * as d3scale from "d3-scale"

import ElementBox from 'components/light-admin/containers/ElementBox'

import {
	processDataForBarChart,
	getHazardName
} from 'utils/sheldusUtils'



class GeographyScoreBarChart extends React.Component {

	processData() {
    	const { geoid, geoLevel, dataType } = this.props;
		try {
			const geoids = this.props.geoGraph[geoid][geoLevel].value
			return processDataForBarChart(get(this.props, this.props.dataType, {}), geoids, this.props.lossType);
		}
		catch (e) {
			return { data: [], keys: [] }
		}
	}
	render() {
		const { data, keys } = this.processData();
		const format = d3format.format(this.props.format);
		if (!data.length) {
			return <ElementBox>Loading...</ElementBox>;
		}
		return (
			<ElementBox>
				<div style={ { height: `${ this.props.height }px` } }>
					<ResponsiveBar
						data={ data }
						keys={ keys }
						indexBy="year"
						colorBy={ d => this.props.colorScale(d.id) }
						enableLabel={ false }
						tooltipFormat={ this.props.format }
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
				            "legend": this.props.lossType,
				            "legendPosition": "center",
				            "legendOffset": -100,
			            	"format": this.props.format
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
GeographyScoreBarChart.defaultProps = {
	height: 500,
	lossType: "property_damage",
	format: "$,d"
}

const mapStateToProps = state => {
  return {
    riskIndexGraph: state.graph.riskIndex || {},
    sheldus: state.graph.sheldus || {},
    severeWeather: state.graph.severeWeather || {},
    sba: state.graph.sba || {},
    geoGraph: state.graph.geo || {},
    riskIndex: state.riskIndex,
    router: state.router,
    geo: state.geo
  }
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GeographyScoreBarChart)