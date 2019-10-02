import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import { falcorChunkerNice } from "store/falcorGraph"

import * as d3scale from "d3-scale";

import get from "lodash.get"

import { ResponsiveBar } from "@nivo/bar"

// import * as d3color from "d3-color"
import * as d3format from "d3-format"
// import * as d3scale from "d3-scale"

import ElementBox from 'components/light-admin/containers/ElementBox'

import {
	processDataForBarChart,
	getHazardName,
	fnum,
	getColorScale
} from 'utils/sheldusUtils'

import {
  EARLIEST_YEAR,
  LATEST_YEAR
} from "./yearsOfSevereWeatherData";

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

  getHazardName(hazard) {
    try {
      return this.props.riskIndexGraph.meta[hazard].name;
    }
    catch (e) {
      return getHazardName(hazard)
    }
  }

    fetchFalcorDeps() {
      const { geoLevel, dataType, geoid } = this.props;

      return this.props.falcor.get(
          ['riskIndex', 'hazards'],
          ['geo', geoid, geoLevel]
      )
      .then(res => res.json.riskIndex.hazards)
      .then(hazards => geoLevel === 'state' ?
					Promise.resolve({ hazards, geoids: [geoid] })
				:
					this.props.falcor.get(['geo', geoid, geoLevel])
						.then(res => ({ hazards, geoids: res.json.geo[geoid][geoLevel] }))
				)
      .then(({ hazards, geoids }) => {
          this.props.colorScale.domain(hazards);

					return [
						['riskIndex', 'meta', hazards, ['id', 'name']],
						['geo', geoids, ['name']]
					].reduce((a, c) => a.then(() => falcorChunkerNice(c)), Promise.resolve())
					.then(() => falcorChunkerNice(['riskIndex', geoids, hazards, ['score', 'value']], { chunckSize: 5 }))
					.then(() => {
						const requests = [];
						for (let h = 0; h < hazards.length; h += 5) {
							requests.push([dataType, geoids, hazards.slice(h, h + 5),
								{ from: EARLIEST_YEAR, to: LATEST_YEAR },
								['property_damage', 'total_loss', 'num_events','num_episodes', 'num_loans']
							])
						}
						return requests.reduce((a, c) => a.then(() => falcorChunkerNice(c, { chunkSize: 5 })), Promise.resolve())
					})

      })
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
					tooltipFormat={ format }
					animate={ false }
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
			            "legendPosition": "middle",
		            	"legendOffset": 40,
		            	"tickRotation": this.props.showYlabel ? 0 : 45
		        	} }
			        axisLeft={ {
			            "orient": "left",
			            "tickSize": 5,
			            "tickPadding": 5,
			            "tickRotation": 0,
			            "legend": this.props.showYlabel ? this.props.lossType : undefined,
			            "legendPosition": "middle",
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
	showXlabel: true,
	geoid: '36',
	geoLevel: 'state',
	colorScale: getColorScale(),
  dataType: "severeWeather"
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

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(GeographyScoreBarChart))
