import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'

import CriticalInfrastructureTable from "./components/CriticalInfrastructureTable"
import HazardList from "./components/HazardListNew"
import HazardMap from "./components/HazardMap"
import HazardEventsMapController from "./components/HazardEventsMapController"
import SbaChoropleth from "./components/SbaChoropleth"

import {
  getColorScale,
  getColors
} from 'utils/sheldusUtils'

import {
  EARLIEST_YEAR,
  LATEST_YEAR
} from "./components/yearsOfSevereWeatherData";

class TestPage extends React.Component {

  state = {
    geoid: '36',
    geoLevel: 'counties',
    dataType: 'severeWeather',
    year: LATEST_YEAR,
    colorScale: getColorScale([1, 2])
  }

  // fetchFalcorDeps() {
  //   const { geoid, geoLevel, dataType } = this.state;
  //   return this.props.falcor.get(
  //     ['geo', geoid, geoLevel],
  //     ['riskIndex', 'hazards']
  //   ).then(data => {
  //     const geographies = data.json.geo[geoid][geoLevel],
  //       hazards = data.json.riskIndex.hazards,
  //       requests = [];
  //     this.setState({ colorScale: getColorScale(hazards) });
  //     for (let i = LATEST_YEAR; i >= EARLIEST_YEAR; i -= 8) {
  //       requests.push([dataType, geographies, hazards, { from: Math.max(i - 7, EARLIEST_YEAR), to: i }, ['num_events','property_damage', 'crop_damage', 'injuries', 'fatalities']])
  //     }
  //     return this.props.falcor.get(
  //       ['riskIndex', 'meta', hazards, ['id', 'name']],
  //       ['geo', geographies, ['name']],
  //       ['riskIndex', geographies, hazards, ['score']],
  //     )
  //     .then(data => requests.reduce((a, c) => a.then(() => this.props.falcor.get(c)), Promise.resolve()))
  //   })
  // }

  render() {
    try {
      return (
        <Element>

          <div className="row">
            <div className="col-12">
              <ElementBox>
                <HazardMap highRisk={ 0.95 }
                  threeD={ false }/>
              </ElementBox>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <CriticalInfrastructureTable highRisk={ 0.95 }/>
            </div>
          </div>

          <HazardList />

        </Element>
      )
    }
    catch (e) {
      return (
        <Element>
          <ElementBox>
            There was an error...
          </ElementBox>
          <ElementBox>
            { e.message }
          </ElementBox>
        </Element>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    riskIndex: state.graph.riskIndex,
    router: state.router
  };
};

const mapDispatchToProps = {};

export default [
  {
    path: '/test',
    name: 'Test Page',
    mainNav: false,
    breadcrumbs: [
    	{ name: 'Test Page', path: '/test' }
    ],
    menuSettings: { image: 'none', scheme: 'color-scheme-light' },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(TestPage))
  }
]