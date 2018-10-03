import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import CapabilitiesTable from 'pages/auth/RiskIndex/components/CapabilitiesTable'
import Submenus from './strategies-submenus'
import Actions from './actions'
import Measures from './measures'
import Funding from './funding'

class Strategies extends Component {
  render () {
   return (
      <div className='property-single'>
         <div className='property-info-w'>
          <div className="property-info-main" style={{paddingBottom: 0}}>
            <div className="property-section">
              <Content content_id={`strategies-overview`} />
            </div>
          </div>
        </div>
      
        <div className='property-info-w'>
          <div className="property-info-main" style={{paddingBottom: 30}}>
            
            <div className="property-section">
              <Content content_id={`capabilities-2019_goals_objectives`} />
            </div>
          </div>
        </div>

        <div className='property-info-w'>
          <div className='property-info-side' style={{maxWidth: '20%', borderRight: 'none'}}>
            <div className='side-section-content' style={{paddingTop: 0 }}>
             <div className='projects-list row'>
              <ProjectBox title={`goal 1`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`capabilities-2019_goals_1`} />
              </ProjectBox>  
            </div>
            
            </div>
          </div>
         <div className="property-info-main" style={{maxWidth: '80%', paddingTop: 0, borderLeft: 'none'}}>
           <div className="property-section">
              <Content content_id={`capabilities-2019_goals_objectives_1`} />
            </div>
          </div>
        </div>

        <div className='property-info-w'>
          <div className='property-info-side' style={{maxWidth: '20%', borderRight: 'none'}}>
            <div className='side-section-content' style={{paddingTop: 0 }}>
             <div className='projects-list row'>
              <ProjectBox title={`goal 2`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`capabilities-2019_goals_2`} />
              </ProjectBox>  
            </div>
            
            </div>
          </div>
         <div className="property-info-main" style={{maxWidth: '80%', paddingTop: 0, borderLeft: 'none'}}>
           <div className="property-section">
              <Content content_id={`capabilities-2019_goals_objectives_2`} />
            </div>
          </div>
        </div>

        <div className='property-info-w'>
          <div className='property-info-side' style={{maxWidth: '20%', borderRight: 'none'}}>
            <div className='side-section-content' style={{paddingTop: 0 }}>
             <div className='projects-list row'>
              <ProjectBox title={`goal 3`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`capabilities-2019_goals_3`} />
              </ProjectBox>  
            </div>
            
            </div>
          </div>
         <div className="property-info-main" style={{maxWidth: '80%', paddingTop: 0, borderLeft: 'none'}}>
           <div className="property-section">
              <Content content_id={`capabilities-2019_goals_objectives_3`} />
            </div>
          </div>
        </div>

        <div className='property-info-w'>
          <div className='property-info-side' style={{maxWidth: '20%', borderRight: 'none'}}>
            <div className='side-section-content' style={{paddingTop: 0 }}>
             <div className='projects-list row'>
              <ProjectBox title={`goal 4`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`capabilities-2019_goals_4`} />
              </ProjectBox>  
            </div>
            
            </div>
          </div>
         <div className="property-info-main" style={{maxWidth: '80%', paddingTop: 0, borderLeft: 'none'}}>
           <div className="property-section">
              <Content content_id={`capabilities-2019_goals_objectives_4`} />
            </div>
          </div>
        </div>

        <div className='property-info-w'>
          <div className='property-info-side' style={{maxWidth: '20%', borderRight: 'none' }}>
            <div className='side-section-content' style={{paddingTop: 0 }}>
             <div className='projects-list row'>
              <ProjectBox title={`goal 5`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`capabilities-2019_goals_5`} />
              </ProjectBox>  
            </div>
            
            </div>
          </div>
         <div className="property-info-main" style={{maxWidth: '80%', paddingTop: 0, paddingBottom: 0, borderLeft: 'none'}}>
           <div className="property-section">
              <Content content_id={`capabilities-2019_goals_objectives_5`} />
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
    path: '/strategies',
    name: 'Strategies',
    exact: true,
    mainNav: true,
    subMenus: Submenus,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    breadcrumbs: [
      {name: 'Strategies', path: '/strategies'}
    ],
    component: connect(() => {}, {})(Strategies),
  },

...Actions,
...Measures,
...Funding,

]
