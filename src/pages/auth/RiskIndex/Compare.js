import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import { createMatchSelector } from 'react-router-redux';

import * as d3scale from "d3-scale";

import Element from 'components/light-admin/containers/Element'

import GeographyScoreBarChart from './components/GeographyScoreBarChart'

import {
  EARLIEST_YEAR,
  LATEST_YEAR
} from "./components/yearsOfSevereWeatherData";

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

class Compare extends Component {

	state = {
      	geoLevel: 'state',
      	geoid: '36',
      	year: LATEST_YEAR
    }

  	fetchFalcorDeps() {
	    const { geoid, geoLevel } = this.state;

	    let dataTypes = [['sheldus'], ['severeWeather'],['sba', 'all']];

    	return this.props.falcor.get(
      		['riskIndex', 'hazards']
    	)
    	.then(data => {
      		const geoids = ['36'],// data.json.geo[geoid][geoLevel],
        		hazards = data.json.riskIndex.hazards,
        		requests = [];
      		COLOR_SCALE.domain(hazards);
      		for (let i = LATEST_YEAR; i >= EARLIEST_YEAR; i -= 5) {
      			dataTypes.forEach(dataType => {
        			requests.push([...dataType, geoids, hazards, { from: Math.max(i - 4, EARLIEST_YEAR), to: i }, ['property_damage', 'total_loss', 'num_events', 'num_loans']])
        		})
      		}
      		return this.props.falcor.get(
        		['riskIndex', 'meta', hazards, ['id', 'name']],
        		['geo', geoids, ['name']],
        		['riskIndex', geoids, hazards, ['score', 'value']]
      		)
      		.then(data => requests.reduce((a, c) => a.then(() => this.props.falcor.get(c)), Promise.resolve()))
    	})
  	}

  render () {
    return (
      	<Element>
      		<h6 className="element-header">New York Statewide Weather Events Data Property Loss</h6>

          <div className='row'>
            <div className='col-lg-12'>
                <h4> Severe Storm  </h4> 
                <GeographyScoreBarChart { ...this.state }
                	dataType={ "severeWeather" }
                  	colorScale={ COLOR_SCALE }
                  	height={ 400 }/>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-12'>
                <h4> Sheldus </h4>
                <GeographyScoreBarChart { ...this.state }
                	dataType={ "sheldus" }
                  	colorScale={ COLOR_SCALE }
                  	height={ 400 }/>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-12'>
                <h4> SBA </h4>
                <GeographyScoreBarChart { ...this.state }
                	dataType={ "sba.all" }
                  	colorScale={ COLOR_SCALE }
                  	lossType="total_loss"
                  	height={ 400 }/>
            </div>
          </div>

          <h6 className="element-header">New York Statewide Weather Events Data Number of Events</h6>
          <div className='row'>
            <div className='col-lg-12'>
                <GeographyScoreBarChart { ...this.state }
                  dataType={ "severeWeather" }
                    colorScale={ COLOR_SCALE }
                    lossType="num_events"
                    height={ 400 }
                    format={ ",d" }/>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-12'>
                <h4> Sheldus </h4> 
                <GeographyScoreBarChart { ...this.state }
                  dataType={ "sheldus" }
                    colorScale={ COLOR_SCALE }
                    lossType="num_events"
                    height={ 400 }
                    format={ ",d" }/>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-12'>
                <h4> SBA Disaster Loans </h4>
                <GeographyScoreBarChart { ...this.state }
                  dataType={ "sba.all" }
                    colorScale={ COLOR_SCALE }
                    lossType="num_loans"
                    height={ 400 }
                    format={ ",d" }/>
            </div>
          </div>

      	</Element>
    )
  }
}

const mapStateToProps = state => {
  return {
    riskIndex: state.riskIndex,
    router: state.router
  };
};

const mapDispatchToProps = {};

export default [
  {
    path: '/compare',
    name: 'Compare',
    mainNav: false,
    breadcrumbs: [
    	{name: 'Compare', path: '/compare'}
    ],
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Compare))
  }
]