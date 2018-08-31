import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import { createMatchSelector } from 'react-router-redux'

import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'

import ProjectBox from 'components/light-admin/containers/ProjectBox'

import MunicipalityStats from "./components/MunicipalityStats"
import CountyHeroStats from "./components/CountyHeroStats"
import HazardList from "./components/HazardListNew"

import {
  getColorScale,
  getColors
} from 'utils/sheldusUtils'

import {
  EARLIEST_YEAR,
  LATEST_YEAR
} from "./components/yearsOfSevereWeatherData";

class CountyPage extends React.Component {

  constructor(props) {
    super(props);

    const { params } = createMatchSelector({ path: '/m/:geoid' })(props) || {},
      { geoid } = params;

    this.state = {
      geoid
    }
  }

  fetchFalcorDeps() {
      return this.props.falcor.get(
        ['geo', this.state.geoid, 'name']
      )
  }

  getGeoidName() {
    try {
      return this.props.geoGraph[this.state.geoid].name;
    }
    catch (e) {
      return "Loading...";
    }
  }

  render() {
    const { geoid } = this.state;
    return (
      <div className='property-single'>

        <div className='property-info-w'>
          <div className="property-info-main" style={ { maxWidth: '60%' } }>
            
            <h1>{ this.getGeoidName() }</h1>

            <div className="property-section">
              <HazardList { ...this.state }/>
            </div>

            <div className="property-section">
              ???????????????
            </div>
            
            <div className="property-section">
              ???????????????
            </div>
            
            <div className="property-section">
              ???????????????
            </div>
          </div>

          <div className='property-info-side' style={ { maxWidth: 398 } }>
            <div className='side-section-content' style={ { paddingTop: 60 } }>

              <div className='projects-list row'>
                <MunicipalityStats { ...this.state }/>
              </div>

              <div className='projects-list row'>
                <CountyHeroStats { ...this.state }/>
              </div>

            </div>
          </div>

        </div>

      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    geoGraph: state.graph.geo,
    router: state.router
  };
};

const mapDispatchToProps = {};

export default [
  {
    path: '/m/:geoid',
    name: 'County Page',
    mainNav: false,
    breadcrumbs: [
    	{ param: 'geoid', path: '/m/' }
    ],
    menuSettings: { image: 'none', scheme: 'color-scheme-light' },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CountyPage))
  }
]