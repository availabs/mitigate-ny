import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import { reduxFalcor } from 'utils/redux-falcor'
import { createMatchSelector } from 'react-router-redux';

import { history } from "store"

import { getChildGeo } from 'store/modules/geo'

import Element from 'components/light-admin/containers/Element'

import PopulationsMap from "./components/PopulationsMap.react"
import PopulationsTable from "./components/PopulationsTable.react"

import Viewport from "components/mapping/escmap/Viewport"
import HazardMap from "pages/auth/RiskIndex/components/HazardMap"

import Submenus from './risk-submenus'


class BuiltEnv extends Component {
  render () {
    return (
      <Element>
        <h6 className="element-header">New York Statewide Built Environment</h6>
        <div className='property-single'>
            <div className='property-info-w'>
              <div className="property-section" style={{paddingTop:30}}>
                <Content content_id={`vulnerabilities-built_environment`} />
              </div>
            </div>
          </div>

        <div className='property-info-w'>
          <div className="property-info-main">
            <div className="property-section" style={{background: '#fff'}}>
              <div style={{paddingLeft:15}}>
                  <h5> Risk Index Built Environment </h5>
              </div>
              <HazardMap  
                height={ 600 }
                hazard={'builtenv'}
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



export default [
  {
    icon: 'icon-map',
    path: '/risk/builtenvironment',
    name: 'Built Environment',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: Submenus,
    component: connect(() => {}, {})(BuiltEnv),
  },
]
