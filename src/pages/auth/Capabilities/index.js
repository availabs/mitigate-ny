import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import CapabilitiesTable from 'pages/auth/RiskIndex/components/CapabilitiesTable'

import Agency from './Agency'
import MitigatingAgencies from './Mitigating-Agencies'
import Resiliency from './Resiliency'
import RiskAssessment from './Risk-Assessment'
import TechSupport from './Tech-Support'
import AdministerFunding from './Administer-Funding'
import ProjectManagement from './Project-Management'
import MitigationConstruction from './Construction'
import OutreachEducation from './Outreach-Education'
import Research from './Research'
import ClimateAdaptation from './Climate-Adaptation'
import HistoricEnvironmental from './Historic-Environmental'
import PlanningRegulatory from './Planning-Regulatory'
import Local from './Counties'
import CapabilitiesSummaryTable from "components/mitigate-ny/CapabilitiesSummaryTable"

import subMenus from './capabilities-submenu'


class Capabilities extends Component {
  render () {
   return (
      <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main" style={{paddingTop: 0, paddingBottom: 0}}>

            <div className="property-section">
              <Content content_id={`capabilities-overview`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-coordination_among_agencies`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-integration-statewide-efforts`} />
            </div>

          </div>
        </div>

        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '60%', paddingTop: 0, paddingBottom: 0}}>
            <div className="property-section">
              <Content content_id={`section2-agency_stakeholder_responsible_for_implementation`} />
            </div>  
          </div>
          <div className='property-info-side' style={{maxWidth: '40%', borderRight: 'none'}}>
            <div className='side-section-content' style={{paddingTop: 50 }}>
             <div className='projects-list row'>
              <ProjectBox title={`Disaster Preparedness Commission (DPC)`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`capabilities-dpc`} />
              </ProjectBox>  
            </div>
           </div>
          </div>
        </div>  



        <div className='property-info-w'>
          <div className="property-info-main"style={{paddingTop: 0}}>
            <div className="property-section">
              <Content content_id={`capabilities-whats_changed_2014`} /> 


            </div>
            <CapabilitiesTable 
              title='Statewide Mitigation Capabilities' 
               type="program"
               columns={ ["name" , "agency" , "hazards" , 'admin', 'url'  , 'capability', 'description'] }
               filterColumns={ ["goal" , 'agency' , 'hazards' , 'admin' , 'capability'] }
               urlColumn={ "url" }
               tableScroll={ true }
               tableLink="/capabilities/manage/new"
               tableLinkLabel="Add Your Agency Programs"
               pageSize={ 20 }
               expandColumns={ ["description"] }/>
            
          </div>
         </div>
      </div>
    )
  }
}



export default [
  {
    icon: 'icon-map',
    path: '/capabilities',
    name: 'NYS Capabilities',
    exact: true,
    mainNav: true,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: subMenus,
    component: connect(() => ({}), {})(Capabilities),
  },
  ...Local,
  ...MitigatingAgencies,
  ...Resiliency,
  ...RiskAssessment,
  ...TechSupport,
  ...AdministerFunding,
  ...ProjectManagement,
  ...MitigationConstruction,
  ...OutreachEducation,
  ...Research,
  ...ClimateAdaptation,
  ...HistoricEnvironmental,
  ...PlanningRegulatory,
  ...Agency
]


