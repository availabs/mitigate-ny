import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import { createMatchSelector } from 'react-router-redux';

import * as d3scale from "d3-scale";

import { history } from "store"

import { getHazardDetail } from 'store/modules/riskIndex';

import Element from 'components/light-admin/containers/Element'

import GeographyScoreTable from './components/GeographyScoreTable'
import GeographyScoreBarChart from './components/GeographyScoreBarChart'
import HazardEventsMapController from "./components/HazardEventsMapController"

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

class Geography extends Component {
  constructor(props) {
    super(props);

    const { params } = createMatchSelector({ path: '/risk-index/g/:geoid' })(props) || { params: { geoid: '36' } },
      { geoid } = params,
      geoLevel = (geoid.length === 2) ? 'counties' : 'cousubs';

    this.state = {
      geoLevel,
      geoid,
      dataType: 'severeWeather',//'sheldus',
      year: LATEST_YEAR
    }
  }

  componentWillMount() {
    const { geoid, geoLevel } = this.state;
    if (!this.props.riskIndex[geoid] || !this.props.riskIndex[geoid][geoLevel]) {
      this.props.getHazardDetail(geoid)
    } 
  }

  componentWillReceiveProps(newProps) {
    const { params } = createMatchSelector({ path: '/risk-index/g/:geoid' })(newProps) || { params: { geoid: '36' } },
      { geoid } = params;
    let geoLevel;
    switch (geoid.length) {
      case 5:
        geoLevel = 'cousubs';
        break;
      default:
        geoLevel = 'counties';
        break;
    }
    this.setState({ geoid, geoLevel });
  }

  componentDidUpdate(oldProps, oldState) {
    if (oldState.geoid != this.state.geoid) {
      this.fetchFalcorDeps();
    }
  }

  fetchFalcorDeps() {
    const { geoid, geoLevel, dataType } = this.state;
    return this.props.falcor.get(
      ['geo', geoid, geoLevel],
      ['riskIndex', 'hazards']
    ).then(data => {
      const geographies = data.json.geo[geoid][geoLevel],
        hazards = data.json.riskIndex.hazards,
        requests = [];
      COLOR_SCALE.domain(hazards);
      for (let i = LATEST_YEAR; i >= EARLIEST_YEAR; i -= 5) {
        requests.push([dataType, geographies, hazards, { from: Math.max(i - 4, EARLIEST_YEAR), to: i }, ['num_events','property_damage', 'crop_damage', 'injuries', 'fatalities']])
      }
      return this.props.falcor.get(
        ['riskIndex', 'meta', hazards, ['id', 'name']],
        ['geo', geographies, ['name']],
        ['riskIndex', geographies, hazards, ['score', 'value']]
      )
      .then(data => requests.reduce((a, c) => a.then(() => this.props.falcor.get(c)), Promise.resolve()))
    })
  }

  setGeoid(geoid) {
    let url = "/risk/36";
    switch (geoid.toString().length) {
      case 5:
        url = `/risk/${ geoid }`
        break;
    }
    history.push(url);
  }

  render () {
    return (
      	<Element>
      		<h6 className="element-header">New York Statewide Risk Index</h6>

          <div className='row'>
            <div className='col-lg-12'>
                <GeographyScoreTable { ...this.state }
                  setGeoid={ this.setGeoid }/>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-12'>
                <GeographyScoreBarChart { ...this.state }
                  setGeoid={ this.setGeoid }
                  colorScale={ COLOR_SCALE }/>
            </div>
          </div>

          <HazardEventsMapController
            colorScale={ COLOR_SCALE }
            showLegend={ true }
            { ...this.state }
            />

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

const mapDispatchToProps = { getHazardDetail };

export default [
  {
    path: '/risk',
    name: 'Risk',
    mainNav: true,
    breadcrumbs: [
      {param: 'geoid', path: '/risk/'}
    ],
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Geography))
  }
]
