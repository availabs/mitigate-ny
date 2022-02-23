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

import SocialIndexMap from "components/mitigate-ny/SocialIndexMapSimple"

import Submenus from './risk-submenus'

let hazardsClasses = [
  {
    title: 'Class A: Low Hazard',
    text: 'Dam failure may cause relatively minor economic or environmental damage.'
  },
   {
    title: 'Class B: Intermediate Hazard',
    text: 'Dam failure may cause significant economic or environmental damage, but loss of life is not expected. There are about 650 Intermediate Hazard dams in New York.'
  },
  {
    title: 'Class C: High Hazard',
    text: 'Dam failure may cause loss of life or other severe consequences. There are about 421 High Hazard dams in New York.'
  },
  {
    title: 'Class D: No Hazard',
    text: 'Dams which have failed or have been removed and no longer present a risk.'
  }

]

class Dams extends Component {
  render () {
    return (
      <Element>
        <h6 className="element-header">Dam Safety</h6>
        <div className='property-single'>
          <div className='property-info-w'>
            <div className="property-section" style={{paddingTop:30}}>
              <div className="property-info-main" style={{maxWidth: 900}}>
                <Content content_id={`vulnerabilities-dam-safety`} />
              </div>
            </div>
            <div className='property-info-side' style={{maxWidth: 398}}>
              <div className='side-section-content' style={{paddingTop: 0 }}>
                <div className='projects-list row'>
                  <ProjectBox  title={`Origins of Dam Safety in NYS`} style={{backgroundColor: '#f2f4f8', width:'100%', marginTop: '3rem'}}>
                    <p>In 1911, New York established the position of "State Inspector of Docks and Dams" to help protect the public from dam faluires.
                    Alexander Rice McKim was the state's first Inspector of Docks and Dams.<br/><br/>

                    On September 30, 1911, the Austin Dam, in Austin Pennsylvania failed causing significant destruction and loss of life in the valley below.
                    The Austin Dam was owned by Binghamton, NY-based Bayless Paper Company.

                    New York published the first version of its engineering requirments for dams by 1912.

                     </p>
                  </ProjectBox>
                </div>

                <div className='projects-list row'>
                  <ProjectBox  title={`Dam Hazard Classification*`} style={{backgroundColor: '#f2f4f8', width:'100%', marginTop: '3150px'}}>
                    <p>
                      {hazardsClasses.map(d => (<div style={{paddingBottom: 15}}><strong>{d.title}</strong> - <span>{d.text}</span></div>))}
                     <i>*Actual definitions in 6NYCRR Part 673. There are about 525 dams in the inventory that have not been assigned a classification. They are typically very small structures and presumed to be Low Hazard.</i>
                     </p>
                      
                  </ProjectBox>
                </div>

              </div>
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
    path: '/risk/dams',
    name: 'Dam Safety',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: Submenus,
    component: Dams,
  },
]
