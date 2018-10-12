import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import CountyPlanChoropleth from "pages/auth/Capabilities/components/CountyPlanChoropleth"
import Submenus from './local-submenus'
import CountyCapabilitiesTable from "components/mitigate-ny/CountyCapabilitiesTable"

class LocalCapabilities extends Component {
  render () {
   return (
      <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main">

            <div className="property-section">
              <Content content_id={`capabilities-lhmp_overview`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-implementation`} />
              

            </div>
           
            
            <div className="property-section">
              <Content content_id={`capabilities-lhmp_status_map`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-lhmp_building_codes`} />
            </div>
            
            <CountyCapabilitiesTable
                descriptions={ [
                  'New York State Building Codes' , 
                  
                  'Building Code Official' ,
                  
                  'Site Plan Review Requirememts' ,
                  'Local Site Plan Regulation' ,
                                    
                  'Local Subdivision Regulations' ,
                  'Subdivision Ordinance' ,       

                  'Growth Management Ordinance' ,
                  'Land Acquisition Ordinance' ,
                                    
                  ] }/>
            
            <div className="property-section">
              <Content content_id={`capabilities-lhmp_zoning`} />
            </div>
            
            <CountyCapabilitiesTable
                descriptions={ [
                  
                  'Comprehensive/Master Plan' , 
                  'Zoning Ordinance/Land Use Regulations' ,
                  'Historical Preservation Plan' ,
                  'Land Use Plan' ,

                  ] }/>

            
            <div className="property-section">
              <Content content_id={`capabilities-flood_water_management`} />
            </div>
            
            <CountyCapabilitiesTable
                descriptions={ [
                  'National Flood Insurance Program' ,
                  'Flood Mitigation Plan (CRS/NFIP/SFHA)' ,
                  'Flood Insurance Rate Map (FIRM)' ,
                  'Floodplain Ordinance' ,
                  'Floodplain Administrator' ,
                  'Storm Water Management Plan' , 
                  'Storm Water / Watershed Management Ordinance' ,
                  'Flood Mitigation Assistance (FMA)' ,
                  'Riparian protection or setbacks' ,
                  'Local Drainage Regulations (Flood and Stormwater)' ,
                  'Coastal Erosion Hazard Area' , 
                  'Dam Safety Program' ,
                  
                  ] }/>

             <div className="property-section">
              <Content content_id={`capabilities-recovery_response_mitigation`} />
            </div>
            
            <CountyCapabilitiesTable
                descriptions={ [
                  'Post-Disaster Redevelopment Plan' , 
                  'Hazard Mitigation Plan' , 
                  'Post-Disaster Recovery Ordinance' ,
                  'Post-Disaster Recovery Plan' ,
                  'Post-Disaster Redevelopment Plan' ,
                  'Property Aquisition Program' ,
                  'Pre-Disaster Mitigation (PDM)' ,
                  'Continuity of Operations Plan' ,
                  'Comprehensive Emergency Management Plan' ,
                  'Emergency Management Plan' ,
                  

                  ] }/>

             <div className="property-section">
              <Content content_id={`capabilities-lhmp_capital_improvement_planning`} />
            </div>

            <CountyCapabilitiesTable
                descriptions={ [
                  'Economic Development Plan' , 
                  'Capital Improvement Plan' ,
                  'Capital Improvement Projects Funding' ,
                  'Community Development Block Grant(s)' ,
                  'DEP Floodplain Management Funding' ,
                  'FEMA Hazard Mitigation Grant Program' ,
                  'Levy taxes for specific purposes' ,
                  'State Funding' ,
                  ] }/>
            <div className="property-section">
              <Content content_id={`capabilities-lhmp_staff`} />
            </div>

            <CountyCapabilitiesTable
                descriptions={ [
                  
                  'Grant Writer' ,
                  'Planner' ,
                  'Highway Department' ,
                  'GIS Specialist' ,
                  'Emergency Management Personnel' , 
                  'Building Code Official' ,
                  'Engineer' ,
                  'Floodplain Administrator' ,
                  'Floodplain Management Personnel' ,
                  'HAZUS Specialist' ,
                  'Public Information Officer' ,


                  ] }/>

          </div>


         </div>
      </div>
    )
  }
}



export default [
  {
    icon: 'icon-map',
    path: '/local/capabilities',
    name: 'Local capabilities',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: Submenus,
    component: connect(() => {}, {})(LocalCapabilities),
  }

]
