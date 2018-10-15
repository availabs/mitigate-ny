import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import Submenus from './about-submenus'

class Implementation extends Component {
  render () {
   return (
  	<div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main">
            

            <div className="property-section">
              <Content content_id={`capabilities-dhses_admin_plan`} />
            </div>
            
            

            
          </div>
        </div>
      </div>


    )
  }
}



export default [
  {
    icon: 'icon-map',
    path: '/about/implementation',
    name: 'Implementation',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: Submenus,
    component: connect(() => {}, {})(Implementation),
  }
]