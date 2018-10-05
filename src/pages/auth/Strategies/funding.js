import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import CapabilitiesTable from 'pages/auth/RiskIndex/components/CapabilitiesTable'
import subMenus from "./strategies-submenus"


class MitigationFunding extends Component {
  render () {
   return (
    <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main">

            <div className="property-section">
              <Content content_id={`capabilities-agency_administered_funding_sources`} />
            </div>

            <div className="property-section"> 
              <Content content_id={`capabilities-local_funding_sources`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-mitigation_strategies`} />
              <CapabilitiesTable
                  title='Mitigation Funding Capabilities'  
                   type="program"
                   capability={'capability_administer_funding'}
                   columns={ ["name" , "description" , "agency" , "hazards" , 'admin' , 'url'] }
                   filterColumns={ ["goal" , 'agency' , 'hazards' , 'admin'] }
                   expandColumns={ ["description"] }/>
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
    path: '/strategies/funding',
    name: 'Mitigation Funding',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: subMenus,
    component: connect(() => {}, {})(MitigationFunding),
  },
]
