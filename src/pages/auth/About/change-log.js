import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import Submenus from './about-submenus'

class MitigationNews extends Component {
  render () {
   return (
  	 <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main">
            <div className="property-section">
              <Content content_id={`change-log`} />
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
    path: '/about/changelog',
    name: 'Changelog',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: Submenus,
    component: connect(() => ({}), {})(MitigationNews),
  }
]