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
          <div className="property-info-main">
 
            <h1>Introduction</h1>
            
            <div className="property-section">
              <Content content_id={`section1-2019whatsnew`} />
            </div>

            <div className="property-section">
              <Content content_id={`section2-planning_process`} />
            </div>
           
            <div className="property-section">
              <Content content_id={`section7-local_mitigation_coordination`} />
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
              <Content content_id={`process-updating_the_plan`} />
            </div>

            <div className="property-section">
              <Content content_id={`planning-enhanced_plan`} />
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
