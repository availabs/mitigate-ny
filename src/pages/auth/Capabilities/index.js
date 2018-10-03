import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import CapabilitiesTable from 'pages/auth/RiskIndex/components/CapabilitiesTable'

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

import subMenus from './capabilities-submenu'


class Capabilities extends Component {
  render () {
   return (
      <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main">

            <div className="property-section">
              <Content content_id={`capabilities-overview`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-whats_changed_2014`} />
              <CapabilitiesTable />
            </div>
          </div>
        </div>

        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '60%', paddingTop: 0, paddingBottom: 0, borderLeft: 'none'}}>
           <div className="property-section">
              <Content content_id={`capabilities-coordination_among_agencies`} />
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
          <div className="property-info-main" style={{paddingTop: 0, paddingBottom: 0}}>
        
            <div className="property-section">
              <Content content_id={`capabilities-mitigation_agencies_participation`} />
            </div>  

            <div className="property-section">
              <Content content_id={`section2-agency_stakeholder_responsible_for_implementation`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-risk_assessment`} />
              <CapabilitiesTable title='Risk Assessment Capabilities' capability={'capability_risk_assessment'}/>
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-techsupport_training_planning`} />
               
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-integration-statewide-efforts`} />
              <CapabilitiesTable title='Technical Support and Training Capabilities'  capability={'capability_tech_support'}/>
            </div>     

          </div>
        </div>

        <div className='property-info-w'>
          <div className="property-info-main" style={{paddingTop: 0, paddingBottom: 0}}>
           
           <div className="property-section">
              <Content content_id={`capabilities-administer_funding`} />
            </div>

           <div className="property-section">
              <Content content_id={`capabilities-federal_funding`} />
            </div>
          </div>
        </div>

         <div className='property-info-w'>
          <div className='property-info-main' style={{paddingTop: 0, paddingBottom: 0, borderRight: 'none'}}>
            <div className='side-section-content' style={{paddingTop: 50 }}>
             <div className='projects-list row'>
              <ProjectBox title={`Federal Funding Administered by DHSES`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`capabilities-dhses_administered_federal_funding`} />
              </ProjectBox>  
            </div>
           </div>
          </div>
        </div>

        <div className='property-info-w'>
          <div className='property-info-main' style={{paddingTop: 0, paddingBottom: 0, maxWidth: '50%', borderRight: 'none'}}>
            <div className='side-section-content' style={{paddingTop: 50 }}>
             <div className='projects-list row'>
              <ProjectBox title={`RiskMAP`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`capabilities-riskmap`} />
              </ProjectBox>
            </div>
          </div>
        </div>

          <div className='property-info-main' style={{paddingTop: 0, paddingBottom: 0, maxWidth: '50%', borderRight: 'none'}}>
            <div className='side-section-content' style={{paddingTop: 50 }}>
             <div className='projects-list row'>
              <ProjectBox title={`National Flood Insurance Program (NFIP)`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`capabilities-nfip`} />
              </ProjectBox>  
            </div>
           </div>
          </div>
        </div>

        <div className='property-info-w'>
          <div className='property-info-main' style={{paddingTop: 0, paddingBottom: 0, maxWidth: '50%', borderRight: 'none'}}>
            <div className='side-section-content' style={{paddingTop: 50 }}>
             <div className='projects-list row'>
              <ProjectBox title={`FEMA Cooperating Technical Partners (CTP)`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`capabilities-ctp`} />
              </ProjectBox>
            </div>
          </div>
        </div>

          <div className='property-info-main' style={{paddingTop: 0, paddingBottom: 0, maxWidth: '50%', borderRight: 'none'}}>
            <div className='side-section-content' style={{paddingTop: 50 }}>
             <div className='projects-list row'>
              <ProjectBox title={`Community Development Block Grant (CDBG)`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`capabilities-cdbg`} />
              </ProjectBox> 

            </div>
           </div>
          </div>
        </div>

        <div className='property-info-w'>
          <div className="property-info-main"style={{paddingTop: 0}}> 

            <div className="property-section">
              <Content content_id={`capabilities-agency_administered_funding_sources`} />
            </div>

            <div className="property-section">
              <Content content_id={`local_funding_sources`} />
               <CapabilitiesTable title='Mitigation Funding Capabilities'  capability={'capability_administer_funding'}/>
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-project_management`} />
               <CapabilitiesTable title='Project Management Capabilities' capability={'capability_project_management'}/>
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-construction`} />
               <CapabilitiesTable title='Mitigation Construction Capabilities' capability={'capability_construction'}/>
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-education_outreach`} />
               <CapabilitiesTable title='Outreach and Public Education Capabilities' capability={'capability_outreach'}/>
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-research`} />
               <CapabilitiesTable title='Hazard Mitigation Research Capabilities' capability={'capability_research'}/>
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-climate_related`} />
            </div>

            <div className="property-section">
              <Content content_id={`section2-integration_climate_adaptation`} />
               <CapabilitiesTable title='Climate Adaptation Capabilities' capability={'capability_climate'}/>
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-historic_evironmental_preservation`} />
               <CapabilitiesTable title='Historic and Environmental Preservation Capabilities' capability={'capability_preservation' , 'capability_environmental'}/>
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-planning_regulatory`} />
               <CapabilitiesTable title='Planning and Regulatory Capabilities' capability={'capability_policy' , 'capability_regulatory'}/>              
            </div>            

            <div className="property-section">
              <Content content_id={`capabilities-local_assets_table`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-hmgp`} />
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
    path: '/capabilities',
    name: 'NYS Capabilities',
    exact: true,
    mainNav: true,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: subMenus,
    component: connect(() => {}, {})(Capabilities),
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
]


