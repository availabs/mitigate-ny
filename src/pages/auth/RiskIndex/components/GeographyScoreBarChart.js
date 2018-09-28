import React from 'react';
import { connect } from 'react-redux';

import get from "lodash.get"

import { ResponsiveBar } from "@nivo/bar"

// import * as d3color from "d3-color"
import * as d3format from "d3-format"
// import * as d3scale from "d3-scale"

import ElementBox from 'components/light-admin/containers/ElementBox'

import {
	processDataForBarChart,
	getHazardName,
	fnum
} from 'utils/sheldusUtils'

class GeographyScoreBarChart extends React.Component {

	getHazardName(hazard) {
		try {
			return this.props.riskIndexGraph.meta[hazard].name;
		}
		catch (e) {
			return getHazardName(hazard)
		}
	}

	processData() {
    	const { geoid, geoLevel, dataType, hazard, lossType } = this.props;
		try {
			let geoids = []
			if (geoLevel === 'state' || geoLevel === 'county') {
				geoids = [geoid];
			}
			else {
				geoids = this.props.geoGraph[geoid][geoLevel].value;
			}
			return processDataForBarChart(get(this.props, dataType, {}), geoids, lossType, hazard);
		}
		catch (e) {
			return { data: [], keys: [] }
		}
	}
	render() {
		const { data, keys } = this.processData(),
			format = d3format.format(this.props.format);
		if (!data.length) {
			return <ElementBox>Loading...</ElementBox>;
		}
		return (
			<div style={ { height: `${ this.props.height }px`, background: '#fff'} }>
				<ResponsiveBar
					data={ data }
					keys={ keys }
					indexBy="year"
					colorBy={ d => this.props.colorScale(d.id) }
					enableLabel={ false }
					tooltipFormat={ this.props.format }
					margin={ {
			            "top": 25,
			            "right": this.props.showYlabel ? 25 : 0,
			            "bottom": this.props.showXlabel ? 50 : 40,
			            "left": this.props.showYlabel ? 90 : 50
		        	} }
					axisBottom={ {
			            "orient": "bottom",
			            "tickSize": 5,
			            "tickPadding": 5,
			            "tickRotation": 0,
			            "legend": this.props.showXlabel ? "Year" : undefined,
			            "legendPosition": "center",
		            	"legendOffset": 40,
		            	"tickRotation": this.props.showYlabel ? 0 : 45
		        	} }
			        axisLeft={ {
			            "orient": "left",
			            "tickSize": 5,
			            "tickPadding": 5,
			            "tickRotation": 0,
			            "legend": this.props.showYlabel ? this.props.lossType : undefined,
			            "legendPosition": "center",
			            "legendOffset": -100,
		            	"format": fnum
			        } }
			        tooltip={
			        	d => (
				        	<div>
				        		<div style={ { display: "inline-block", width: "15px", height: "15px", backgroundColor: this.props.colorScale(d.id) } }/>
				        		<span style={ { paddingLeft: "5px" } }>{ this.getHazardName(d.id) }</span>
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
		)
	}
}
GeographyScoreBarChart.defaultProps = {
	height: 500,
	lossType: "property_damage",
	format: "$,d",
	hazard: null,
	showYlabel: true,
	showXlabel: true
}

const mapStateToProps = state => {
  return {
    riskIndexGraph: state.graph.riskIndex || {},
    sheldus: state.graph.sheldus || {},
    severeWeather: state.graph.severeWeather || {},
    sba: state.graph.sba || {},
    geoGraph: state.graph.geo || {},
    router: state.router
  }
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GeographyScoreBarChart)