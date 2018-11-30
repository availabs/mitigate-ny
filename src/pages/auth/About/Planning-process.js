import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import Submenus from './about-submenus'

class PlanningProcess extends Component {
  render () {
   return (
      <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '70%', paddingBottom: 0}}>
           <div className="property-section">
              <Content content_id={`section2-planning_process`} />
            </div>
          </div>
          <div className='property-info-side' style={{maxWidth: '30%', borderRight: 'none'}}>
            <div className='side-section-content' style={{paddingTop: 60 }}>
             <div className='projects-list row'>
              <ProjectBox title={`History of the New York State Hazard Mitigation Plan`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`process-history`} />
              </ProjectBox>

              <ProjectBox title={`2019 SHMP Milestones`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`process-milestones`} />
              </ProjectBox>  

            </div>
           </div>
          </div>
        </div>

        <div className='property-info-w'>
          <div className="property-info-main"style={{paddingTop: 0}}>
           <div className="property-section">
              <Content content_id={`process-new-narrative`} />
            </div>
          </div>
          <div className='property-info-side' style={{maxWidth: '30%', borderRight: 'none'}}>
            <div className='side-section-content' style={{paddingTop: 50 }}>
             <div className='projects-list row'>
              <ProjectBox title={`What's New in the 2019 Update to the New York State Hazard Mitigation Plan`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`section1-2019whatsnew`} />
              </ProjectBox>  
            </div>
            <div className='projects-list row'>
              <ProjectBox title={`The 2014 and 2019 SHMP Road Maps`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`process-road_map`} />
              </ProjectBox>  
            </div>
           </div>
          </div>
        </div> 

        <div className='property-info-w'>
          <div className="property-info-main"style={{paddingTop: 0}}>    
            
            <div className="property-section">
              <Content content_id={`section7-integration_local_state_mitigation_efforts`} />
            </div>

            <div className="property-section">
              <Content content_id={`section2-plan_maintenance`} />
            </div>

            <div className="property-section">
              <Content content_id={`section7-lhmp_maintenance`} />
            </div>

            <div className="property-section">
              <Content content_id={`planning-critical_infrastructure_state_owned_assets`} />
            </div>

            <div className="property-section">
              <Content content_id={`section2-implementation_maintenance_softwaretech`} />
            </div>

            <div className="property-section">
              <Content content_id={`planning-enhanced_plan`} />
            </div>

            <div className="property-section">
              <Content content_id={`process-updating_the_plan`} />
            </div>
                      
            <div className="property-section">
              <Content content_id={`section1-adoptionassurances`} />
            </div>

            <div className="property-section">
              <Content content_id={`section2-genplanguidelines`} />
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
    path: '/about/process',
    name: 'The Planning Process',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    component: connect(() => {}, {})(PlanningProcess),
  }
]
