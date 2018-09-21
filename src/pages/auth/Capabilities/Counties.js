import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import CountyPlanChoropleth from "pages/auth/Capabilities/components/CountyPlanChoropleth"
import subMenus from "./capabilities-submenu"

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
              <Content content_id={`capabilities-lhmp_status_map`} />
            </div>

            <div className="property-section">
              <Content content_id={`section7-integration_local_state_mitigation_efforts`} />
            </div>

            <div className="property-section">
              <Content content_id={`section7-funding_plans_projects`} />
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
    name: 'Local',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: subMenus,
    component: connect(() => {}, {})(Local),
  }
]
