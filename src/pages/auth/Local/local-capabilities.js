import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import CountyPlanChoropleth from "pages/auth/Capabilities/components/CountyPlanChoropleth"
import Submenus from './local-submenus'

class LocalCapabilities extends Component {
  render () {
   return (
      <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main">

            <div className="property-section">
              <Content content_id={` capabilities-lhmp_overview`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-implementation`} />
            </div>
           
            
            <div className="property-section">
              <Content content_id={`capabilities-lhmp_status_map`} />
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
    path: '/local/capabilities',
    name: 'Local capabilities',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: Submenus,
    component: connect(() => {}, {})(LocalCapabilities),
  }

]
