import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'

import HazardList from "./components/HazardListNew"

import {
  getColorScale,
  getColors
} from 'utils/sheldusUtils'

import {
  EARLIEST_YEAR,
  LATEST_YEAR
} from "./components/yearsOfSevereWeatherData";

class Test extends React.Component {

  state = {
    geoid: '36',
    geoLevel: 'counties',
    dataType: 'severeWeather',
    year: LATEST_YEAR,
    colorScale: getColorScale([1, 2])
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
      for (let i = LATEST_YEAR; i >= EARLIEST_YEAR; i -= 8) {
        requests.push([dataType, geographies, hazards, { from: Math.max(i - 7, EARLIEST_YEAR), to: i }, ['num_events','property_damage', 'crop_damage', 'injuries', 'fatalities']])
      }
      return this.props.falcor.get(
        ['riskIndex', 'meta', hazards, ['id', 'name']],
        ['geo', geographies, ['name']],
        ['riskIndex', geographies, hazards, ['score', 'value']],
      )
      .then(data => requests.reduce((a, c) => a.then(() => this.props.falcor.get(c)), Promise.resolve()))
    })
  }

  render() {
    try {
      const hazards = this.props.riskIndex.hazards.value;
      return (
        <Element>
          <h6 className="element-header">Map Test</h6>

          <div className="row">
            <div className="col-12">
              <ElementBox>
                <HazardList geoid="36"/>
              </ElementBox>
            </div>
          </div>

        </Element>
      )
    }
    catch (e) {
      return <ElementBox>Loading...</ElementBox>
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
    	{name: 'Test Page', path: '/test'}
    ],
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Test))
  }
]