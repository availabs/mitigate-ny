import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import AgencyList from './components/AgencyList'
import ProjectBox from 'components/light-admin/containers/ProjectBox'

class Landing extends Component {
  render () {
   return (
      <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main" style={{paddingBottom: 30}}>
            
            <div className="property-section">
              <Content content_id={`capabilities-2019_goals_objectives`} />
            </div>
          </div>
        </div>

        <div className='property-info-w'>
          <div className='property-info-side' style={{maxWidth: 398, borderRight: 'none'}}>
            <div className='side-section-content' style={{paddingTop: 0 }}>
             <div className='projects-list row'>
              <ProjectBox title={`goal 1`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`capabilities-2019_goals_1`} />
              </ProjectBox>  
            </div>
            
            </div>
          </div>
         <div className="property-info-main" style={{maxWidth: '60%', paddingTop: 0, borderLeft: 'none'}}>
           <div className="property-section">
              <Content content_id={`capabilities-2019_goals_objectives_1`} />
            </div>
          </div>
        </div>

        <div className='property-info-w'>
          <div className='property-info-side' style={{maxWidth: 398, borderRight: 'none'}}>
            <div className='side-section-content' style={{paddingTop: 0 }}>
             <div className='projects-list row'>
              <ProjectBox title={`goal 2`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`capabilities-2019_goals_2`} />
              </ProjectBox>  
            </div>
            
            </div>
          </div>
         <div className="property-info-main" style={{maxWidth: '60%', paddingTop: 0, borderLeft: 'none'}}>
           <div className="property-section">
              <Content content_id={`capabilities-2019_goals_objectives_2`} />
            </div>
          </div>
        </div>

        <div className='property-info-w'>
          <div className='property-info-side' style={{maxWidth: 398, borderRight: 'none'}}>
            <div className='side-section-content' style={{paddingTop: 0 }}>
             <div className='projects-list row'>
              <ProjectBox title={`goal 3`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`capabilities-2019_goals_3`} />
              </ProjectBox>  
            </div>
            
            </div>
          </div>
         <div className="property-info-main" style={{maxWidth: '60%', paddingTop: 0, borderLeft: 'none'}}>
           <div className="property-section">
              <Content content_id={`capabilities-2019_goals_objectives_3`} />
            </div>
          </div>
        </div>

        <div className='property-info-w'>
          <div className='property-info-side' style={{maxWidth: 398, borderRight: 'none'}}>
            <div className='side-section-content' style={{paddingTop: 0 }}>
             <div className='projects-list row'>
              <ProjectBox title={`goal 4`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`capabilities-2019_goals_4`} />
              </ProjectBox>  
            </div>
            
            </div>
          </div>
         <div className="property-info-main" style={{maxWidth: '60%', paddingTop: 0, borderLeft: 'none'}}>
           <div className="property-section">
              <Content content_id={`capabilities-2019_goals_objectives_4`} />
            </div>
          </div>
        </div>

        <div className='property-info-w'>
          <div className='property-info-side' style={{maxWidth: 398, borderRight: 'none' }}>
            <div className='side-section-content' style={{paddingTop: 0 }}>
             <div className='projects-list row'>
              <ProjectBox title={`goal 5`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`capabilities-2019_goals_5`} />
              </ProjectBox>  
            </div>
            
            </div>
          </div>
         <div className="property-info-main" style={{maxWidth: '60%', paddingTop: 0, borderLeft: 'none'}}>
           <div className="property-section">
              <Content content_id={`capabilities-2019_goals_objectives_5`} />
            </div>
          </div>
        </div>

        <div className='property-info-w'>
          <div className="property-info-main">
            <div className="property-section">
              <Content content_id={`capabilities-whats_changed_2014`} />
            </div>

            <div className="property-section">
              <Content content_id={`section2-coordination_agency_departments`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-program_table`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-mitigation_strategies`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-dhses_admin_plan`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-agency_administered_funding_sources`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-local_funding_sources`} />
            </div>

            <div className="property-section">
              <Content content_id={`section2-agency_stakeholder_responsible_for_implementation`} />
            </div>

            <div className="property-section">
              <Content content_id={`section7-integration_local_state_mitigation_efforts`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-submittal_review_process`} />
            </div>

            <div className="property-section">
              <Content content_id={`section7-funding_plans_projects`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-local_assets_table`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-hmgp`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-lhmp_status_map`} />
            </div>

          </div>
         </div>

        <AgencyList />
      </div>
    )
  }
}



export default [
  {
    icon: 'icon-map',
    path: '/capabilities',
    name: 'Capabilities',
    exact: true,
    mainNav: true,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    component: connect(() => {}, {})(Landing),
  }
]
