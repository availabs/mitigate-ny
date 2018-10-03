import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import Submenus from './about-submenus'

class ExecutiveSummary extends Component {
  render () {
   return (
  	<div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main">
            
            <h1>2019 New York State Hazard Mitigation Plan</h1>
            

            
          </div>
           
        </div>
      </div>


    )
  }
}



export default [
  {
    icon: 'icon-map',
    path: '/about/plan',
    name: 'Executive Summary',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: Submenus,
    component: connect(() => {}, {})(ExecutiveSummary),
  }
]