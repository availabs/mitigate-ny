import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import { createMatchSelector, push } from 'react-router-redux';

import * as d3scale from "d3-scale";

import { getHazardDetail } from 'store/modules/riskIndex';

import Element from 'components/light-admin/containers/Element'

import HazardMap from "pages/auth/RiskIndex/components/HazardMap"
import ElementBox from 'components/light-admin/containers/ElementBox'
import Content from 'components/cms/Content'
import Submenus from './risk-submenus'





import {
  getColorScale
} from 'utils/sheldusUtils'

import {
  EARLIEST_YEAR,
  LATEST_YEAR
} from "../RiskIndex/components/yearsOfSevereWeatherData";

class riskindexpage extends Component {
  render () {
    return (
      	
        <Element>
        <h6 className="element-header">New York Statewide Vulnerabilities</h6>
        <div className='property-single'>
            <div className='property-info-w'>
              <div className="property-section" style={{paddingTop:30}}>
                <Content content_id={`vulnerabilities-riskindex_vulnerabilities`} />
              </div>
            </div>
          </div>


        <div className='property-info-w'>
          <div className="property-info-main">
            <div className="property-section" style={{background: '#fff'}}>
              <div style={{paddingLeft:15}}>
                  <h5> Social Vulnerability Index (SOVI) </h5>
              </div>
              <HazardMap  
                height={ 600 }
                hazard={'sovi'}
                threeD={false}
                highRisk={0.0}
                geoid='36'
              />
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
    path: '/risk/vulnerablepopulations',
    name: 'Vulnerable Populations',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: Submenus,
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(riskindexpage))
  },



]
