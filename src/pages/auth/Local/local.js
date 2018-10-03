import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import CountyPlanChoropleth from "pages/auth/Capabilities/components/CountyPlanChoropleth"
import Submenus from './local-submenus'
import LocalCapabilities from './local-capabilities'

class Local extends Component {
  render () {
   return (
      <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main">

           
           
            <div className="property-section">
              <Content content_id={`capabilities-lhmp_status_narrative`} />
              <CountyPlanChoropleth />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-lhmp`} />
            </div>  

            <div className="property-section">
              <Content content_id={`section7-lhmp_submittal_review_process`} />
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
    path: '/local',
    name: 'Local Mitigation Planning',
    exact: true,
    mainNav: true,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: Submenus,
    component: connect(() => {}, {})(Local),
  },

  ...LocalCapabilities
]
