import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import { createMatchSelector, push } from 'react-router-redux';

import * as d3scale from "d3-scale";

import { getHazardDetail } from 'store/modules/riskIndex';

import Element from 'components/light-admin/containers/Element'

import GeographyScoreTable from '../RiskIndex/components/GeographyScoreTable'
import GeographyScoreBarChart from '../RiskIndex/components/GeographyScoreBarChart'
import HazardEventsMapController from "../RiskIndex/components/HazardEventsMapController"
import HazardList from "pages/auth/RiskIndex/components/HazardListNew"
import ElementBox from 'components/light-admin/containers/ElementBox'
import Content from 'components/cms/Content'
import Submenus from './risk-submenus'
import nfip from './nfip'
import bric from './bric'
import builtenv from './builtenv'
import hazardhistory from './hazard-history'
import riskindex from './riskindex'
import riskVulnerabilities from './Vulnerabilities-page'
import FloodplainMapper from './flood-mapper'
import AssetInventory  from './asset-inventory'
import FloodLossEstimates from './flood-loss-estimation'

import {
  getColorScale
} from 'utils/sheldusUtils'

import {
  EARLIEST_YEAR,
  LATEST_YEAR
} from "../RiskIndex/components/yearsOfSevereWeatherData";

class Geography extends Component {
  constructor(props) {
    super(props);

    const { params } = createMatchSelector({ path: '/risk/:geoid' })(props) || { params: { geoid: '36' } },
      { geoid } = params,
      geoLevel = (geoid.length === 2) ? 'counties' : 'cousubs';

    this.state = {
      geoLevel,
      geoid,
      dataType: 'severeWeather',
      year: LATEST_YEAR,
      colorScale: getColorScale([1, 2])
    }
  }

  componentWillMount() {
    const { geoid, geoLevel } = this.state;
    if (!this.props.riskIndex[geoid] || !this.props.riskIndex[geoid][geoLevel]) {
      this.props.getHazardDetail(geoid)
    } 
  }

  componentWillReceiveProps(newProps) {
    const { params } = createMatchSelector({ path: '/risk/:geoid' })(newProps) || { params: { geoid: '36' } },
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
    if (oldState.geoid !== this.state.geoid) {
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
      this.setState({ colorScale: getColorScale(hazards) });
      for (let i = LATEST_YEAR; i >= EARLIEST_YEAR; i -= 5) {
        requests.push([dataType, geographies, hazards, { from: Math.max(i - 4, EARLIEST_YEAR), to: i }, ['num_events','property_damage', 'crop_damage', 'injuries', 'fatalities']])
      }
      return this.props.falcor.get(
        ['riskIndex', 'meta', hazards, ['id', 'name']],
        ['geo', geographies, ['name']],
        ['riskIndex', geographies, hazards, ['score', 'value']],
        ['riskIndex', 'meta', hazards, ['id', 'name']]
      )
      .then(data => requests.reduce((a, c) => a.then(() => this.props.falcor.get(c)), Promise.resolve()))
    })
  }

  setGeoid(geoid) {
    let url = "/risk";
    switch (geoid.toString().length) {
      case 5:
        url = `/risk/${ geoid }`
        break;
    }
    this.props.push(url);
  }

  render () {
    return (
      	
        <Element>
          <h6 className="element-header">New York Statewide Risk</h6>
          <div className='property-single'> 
            <div className='property-info-w'>


                <div className="property-section">
                  <Content content_id={`risk-landing`} />
                </div>
            </div>
            <div className='property-info-w'>
                <div className="property-section">
                  <Content content_id={`risk-index`} />
                </div>
            </div>
            <div className='property-info-w'>
                <div className="property-section">
                  <Content content_id={`risk-methodology`} />
                </div>
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

const mapDispatchToProps = {
  getHazardDetail,
  push: url => dispatch => dispatch(push(url))
};

export default [
  {
    path: '/risk',
    name: 'Risk',
    exact: true,
    mainNav: true,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    breadcrumbs: [
      {param: 'geoid', path: '/risk/'}
    ],
    subMenus: Submenus,
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Geography))
  },

  ...nfip,
  ...riskindex,
  ...builtenv,
  ...bric,
  ...hazardhistory,
  ...riskVulnerabilities,
  ...FloodplainMapper,
  ...AssetInventory,
  ...FloodLossEstimates,

]
