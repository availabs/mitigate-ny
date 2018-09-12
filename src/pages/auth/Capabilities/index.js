import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import CapabilitiesTable from 'pages/auth/RiskIndex/components/CapabilitiesTable'

import Counties from './Counties'
import Agencies from './Agencies'

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
            </div>
          </div>
        </div>

        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '60%', paddingTop: 0, paddingBottom: 0, borderLeft: 'none'}}>
           <div className="property-section">
              <Content content_id={`capabilities-integration-statewide-efforts`} />
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
                <Content content_id={`capabilities-cdbg`} />
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
              <Content content_id={`capabilities-coordination_among_agencies`} />
            </div>

            <div className="property-section">
              <Content content_id={`section2-integration_climate_adaptation`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-program_table`} />
              <CapabilitiesTable />
            </div>

            <div className="property-section">
              <Content content_id={`section2-agency_stakeholder_responsible_for_implementation`} />
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
    name: 'Capabilities',
    exact: true,
    mainNav: true,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: [[
       {name: 'Agencies', path: '/agencies'},
       {name: 'Counties', path: '/counties'},
    ]],
    component: connect(() => {}, {})(Capabilities),
  },
  ...Counties,
  ...Agencies
]
