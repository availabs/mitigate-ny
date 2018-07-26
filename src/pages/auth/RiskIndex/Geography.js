import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import { history } from "store"

import { createMatchSelector } from 'react-router-redux';

import { getHazardDetail } from 'store/modules/riskIndex';

import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'

import GeographyScoreTable from './components/GeographyScoreTable'
import GeographyScoreBarChart from './components/GeographyScoreBarChart'
import HazardEventsMapController from "./components/HazardEventsMapController"

import {
  EARLIEST_YEAR,
  LATEST_YEAR
} from "./components/yearsOfSevereWeatherData";

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
    let geoLevel, geojson;
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
    let url = "/risk-index/g/36";
    switch (geoid.toString().length) {
      case 5:
        url = `/risk-index/g/${ geoid }`
        break;
    }
    history.push(url);
  }

  render () {
    const mapsOnly = false;
    return (
      	<Element>
      		<h6 className="element-header">New York Statewide Risk Index</h6>
          <div className='row'>
            <div className='col-lg-12'>
              { mapsOnly ? null : <GeographyScoreTable { ...this.state }
                setGeoid={ this.setGeoid }/> }
            </div>
          </div>
          <div className='row'>
            <div className='col-lg-12'>
              { mapsOnly ? null : <GeographyScoreBarChart { ...this.state }
                setGeoid={ this.setGeoid }/> }
            </div>
          </div>

          <HazardEventsMapController
            showLegend={ true }
            { ...this.state }
            numMaps={ 12 }/>

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
    path: '/risk-index/g/:geoid',
    subMenus: [],
    name: 'Risk Index',
    auth: true,
    breadcrumbs: [
      {name: 'RISK INDEX', path: '/risk-index'},
      {param: 'geoid', path: '/risk-index/g/'}
    ],
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Geography))
  }
]
