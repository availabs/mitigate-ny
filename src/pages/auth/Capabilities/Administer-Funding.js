import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import CapabilitiesTable from 'pages/auth/RiskIndex/components/CapabilitiesTable'
import subMenus from "./capabilities-submenu"


class AdministerFunding extends Component {
  render () {
   return (
    <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main" style={{paddingTop: 0, paddingBottom: 0}}>
           
           <div className="property-section">
              <Content content_id={`capabilities-administer_funding`} />
            </div>

           <div className="property-section">
              <Content content_id={`capabilities-federal_funding`} />
            </div>
          

            <div className="property-section">
              <Content content_id={`capabilities-dhses_administered_federal_funding`} />
            </div>
          </div>
        </div>

        <div className='property-info-w'>
          <div className='property-info-main' style={{paddingTop: 0, paddingBottom: 0, maxWidth: '50%', borderRight: 'none'}}>
            <div className='side-section-content' style={{paddingTop: 50 }}>
             <div className='projects-list row'>
              <ProjectBox title={`Hazard Mitigation Grant Program (HMGP)`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`capabilities-hmgp`} />
              </ProjectBox>
            </div>
          </div>
        </div>

          <div className='property-info-main' style={{paddingTop: 0, paddingBottom: 0, maxWidth: '50%', borderRight: 'none'}}>
            <div className='side-section-content' style={{paddingTop: 50 }}>
             <div className='projects-list row'>
              <ProjectBox title={`Pre-Disaster Mitigation Program Grant (PDM)`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`capabilities-pdm`} />
              </ProjectBox>

            </div>
           </div>
          </div>
        </div>

        <div className='property-info-w'>
          <div className='property-info-main' style={{paddingTop: 0, paddingBottom: 0, maxWidth: '50%', borderRight: 'none'}}>
            <div className='side-section-content' style={{paddingTop: 50 }}>
             <div className='projects-list row'>
              <ProjectBox title={`Flood Mitigation Assistance Program (FMA)`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`capabilities-fma`} />
              </ProjectBox>  
            </div>
          </div>
        </div>
        <div className='property-info-main' style={{paddingTop: 0, paddingBottom: 0, maxWidth: '50%', borderRight: 'none'}}>
            <div className='side-section-content' style={{paddingTop: 50 }}>
             <div className='projects-list row'>
              <ProjectBox title={`Other, Non-Mitigation Federal Funding Administered by DHSES`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`capabilities-funding_other`} />
              </ProjectBox>
              
            </div>
           </div>
          </div>
      </div>

        <div className='property-info-w'>
          <div className="property-info-main" style={{paddingTop: 0, paddingBottom: 0}}>
           <div className="property-section">
              <Content content_id={`capabilities-other_federal_funding`} />
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
              <Content content_id={`capabilities-global_match`} />
              <CapabilitiesTable 
               title='Mitigation Funding Capabilities'  
               type="program"
               capability={'capability_administer_funding'}
               columns={ ["name" , "description" , "agency" , "hazards" , 'admin' , 'url'] }
               filterColumns={ ["goal" , 'agency' , 'hazards' , 'admin'] }
               urlColumn="url"
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
    path: '/capabilities/administerfunding',
    name: 'AdministerFunding',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: subMenus,
    component: connect(() => {}, {})(AdministerFunding),
  },
]
