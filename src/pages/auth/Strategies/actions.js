import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import CapabilitiesTable from 'pages/auth/RiskIndex/components/CapabilitiesTable'
import subMenus from "./strategies-submenus"
import HMGPTable from 'pages/auth/RiskIndex/components/HMGPTable'


class MitigationActions extends Component {
  render () {
   return (
    <div>
      <div className='property-single'>
          <div className='property-info-w' style={{paddingTop: 0 , paddingBottom: 0}}>
            <div className="property-info-main">

              <div className="property-section">
                <Content content_id={`strategies-actions`} />
              </div>

              <div className="property-section">
                <Content content_id={`strategies-actions_activities`} />
              </div>

              <div className="property-section">
                <Content content_id={`strategies-actions-prioritization`} />
              </div>

              <div className="property-section">
                <Content content_id={`strategies-actions_table`} />
                <CapabilitiesTable
                    columns={ ["name" , "description" , "agency" , "hazards" , 'primary_funding' , "budget_provided" , "status"] }
                    title="Mitigation Actions"
                    filterColumns={ ["goal" , 'agency', 'hazards' , 'status' , 'priority' , 'benefit_cost_analysis' , 'primary_funding'] }
                    expandColumns={ ["description"] }
                    tableScroll={ true }
                    type="action"/>
                <div className="property-section">
                  <Content content_id={'hazards-hmgp-overview'} />
                </div> 
                  
                </div>
              </div>
            </div>
          </div>
          <div className='property-single' style={{padding: 15}}>
           <HMGPTable 
               filterColumns={ ['hazard' , 'status' , 'program area' ] }
               tableScroll={ true }
               hazard="none" 
               />
                <i style={{color: '#afafaf'}}>Source: <a href='https://www.fema.gov/openfema-dataset-hazard-mitigation-assistance-projects-v1'> FEMA Hazard Mitigation Assistance Projects - V1</a></i>
          </div>
        </div>

      
    )
  }
}



export default [
  {
    icon: 'icon-map',
    path: '/strategies/actions',
    name: 'ProjectManagement',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: subMenus,
    component: MitigationActions,
  },
]
