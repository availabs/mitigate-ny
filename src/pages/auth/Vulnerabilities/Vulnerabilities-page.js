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
import ElementBox from 'components/light-admin/containers/ElementBox'

import ACS_Map from "components/mitigate-ny/ACS_Map"


class VulnerabilitiesPage extends Component {
  render () {
    return (
      <Element>
        <h6 className="element-header">New York Statewide Vulnerabilities</h6>

          <div className='property-single'>
            <div className='property-info-w'>
              <div className="property-section" style={{paddingTop:30}}>
                <Content content_id={`vulnerabilities-change_pop_built`} />
              </div>
            </div>
          </div>


          <div className='row'>
            <div className='col-lg-12'>
              <ElementBox>
                <ACS_Map variable="population_change"
                  geoLevel="tracts"
                  density={ true }
                  range={ ["#d7191c","#fdae61","#ffffbf","#a6d96a","#1a9641"] }
                  scaleType="quantile"/>
              </ElementBox>
            </div>
          </div>

        <div className='property-single'>
            <div className='property-info-w'>
              <div className="property-section" style={{paddingTop:30}}>
                <Content content_id={`vulnerabilities-population_change_table`} />
              </div>
            </div>
          </div> 

          <div className='row'>
            <div className='col-lg-12'>
              <ElementBox>
                <ACS_Map variable="population_change"
                  range={ ["#d7191c","#fdae61","#ffffbf","#a6d96a","#1a9641"] }
                  scaleType="quantile"/>
              </ElementBox>
            </div>
          </div>
      </Element>
    )
  }
}



export default [
  {
    icon: 'icon-map',
    path: '/risk/vulnerabilities',
    name: 'VulnerabilitiesPage',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: Submenus,
    component: connect(() => {}, {})(VulnerabilitiesPage),
  },
]
