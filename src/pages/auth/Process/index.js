import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'
import ProjectBox from 'components/light-admin/containers/ProjectBox'

class Landing extends Component {
  render () {
   return (
      <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '70%', paddingTop: 0, paddingBottom: 0, borderLeft: 'none'}}>
           <div className="property-section">
              <Content content_id={`section2-planning_process`} />
            </div>
          </div>
          <div className='property-info-side' style={{maxWidth: '30%', borderRight: 'none'}}>
            <div className='side-section-content' style={{paddingTop: 50 }}>
             <div className='projects-list row'>
              <ProjectBox title={`History of the New York State Hazard Mitigation Plan`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`process-history`} />
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
           </div>
          </div>
        </div> 

        <div className='property-info-w'>
          <div className="property-info-main"style={{paddingTop: 0}}>    
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
    path: '/process',
    name: 'Planning Process',
    exact: true,
    mainNav: true,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    component: connect(() => {}, {})(Landing),
  }
]
