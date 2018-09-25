import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import CapabilitiesTable from 'pages/auth/RiskIndex/components/CapabilitiesTable'
import subMenus from "./capabilities-submenu"


class TechSupport extends Component {
  render () {
   return (
<div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main" style={{paddingTop: 0, paddingBottom: 0}}>
        
            <div className="property-section">
              <Content content_id={`capabilities-techsupport_training_planning`} />
               
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-integration-statewide-efforts`} />
              <CapabilitiesTable title='Technical Support and Training Capabilities'  capability={'capability_tech_support'}/>
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
    path: '/capabilities/techsupport',
    name: 'TechSupport',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: subMenus,
    component: connect(() => {}, {})(TechSupport),
  },
]
