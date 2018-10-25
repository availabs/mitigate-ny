import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import CountyPlanChoropleth from "pages/auth/Capabilities/components/CountyPlanChoropleth"
import Submenus from './local-submenus'
import LocalCapabilities from './local-capabilities'
import HMGPTable from 'pages/auth/RiskIndex/components/HMGPTable'
import CountyCapabilitiesTable from "components/mitigate-ny/CountyCapabilitiesTable"

class Local extends Component {
  render () {
   return (
      <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main" style={{paddingBottom: 0}}>

           
           
            <div className="property-section">
              <Content content_id={`capabilities-lhmp_status_narrative`} />
              <CountyPlanChoropleth />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-lhmp`} />
            </div>
            <div className="property-section">
              <Content content_id={`capabilities-lhmp_hazards`} />
            </div>
          </div>
         </div>

          

            <CountyCapabilitiesTable
                
                descriptions={ [
                     'Avalanche' ,
                     'Coastal Erosion' ,
                     'High Wave Action'  ,
                      'Drought' ,
                      'Earthquake' ,
                      'Extreme Cold' ,
                      'Extreme Heat' ,
                      'Flood' ,
                      'Hail' ,
                      
                      'High Winds' ,
                      'Hurricane'  ,
                      'Ice' ,
                      'Landslide' ,
                      'Lightning' ,
                      'Snow' ,
                      'Tornado' ,
                      'Tsunami' ,
                      'Wildfire' , 
                      'Volcano' , 
                                           
                      ] }/> 


        <div className='property-info-w'>
          <div className="property-info-main" style={{paddingTop: 0, paddingBottom: 0}}>
            <div className="property-section">
              <Content content_id={`capabilities-lhmp_hazards-of-concern`} />
            </div>
           </div>
         </div> 

            <CountyCapabilitiesTable
                
                descriptions={ [
                      'Hazardous Materials (HAZMAT fixed and in transit)' ,
                       'HazMat-Fixed Site' ,
                       'HazMat-In Transit' ,
                       'Dam Failure' ,
                       'Epidemic' ,
                       'Blight' ,
                       'Disease Outbreaks' ,
                       'Infestation / Invasive Species' ,
                       'Utility Failure' ,
                       'Severe Storms' ,
                       'Severe Winter Storms' ,
                       'Terrorism' ,
                       'Food Shortage' ,
                       'Water Supply Contamination' ,
                       'Air Contamination' , 
                       'Contamination - air and water' ,
                       'Transportation Accident'
                                           
                      ] }/>          

          

         <div className='property-info-w'>
          <div className="property-info-main"  style={{paddingTop: 0}}>
            <div className="property-section">
              <Content content_id={`section7-lhmp_submittal_review_process`} />
            </div>
            <div className="property-section">  
              <Content content_id={`section7-funding_plans_projects`} />
            </div>
            <HMGPTable 
                 filterColumns={ ['hazard' , 'status' , 'program area' ] }/>
                  <i style={{color: '#afafaf'}}>Source: <a href='https://www.fema.gov/openfema-dataset-hazard-mitigation-assistance-projects-v1'> FEMA Hazard Mitigation Assistance Projects - V1</a></i>
            
            <div className="property-section">  
              <Content content_id={`capabilities-lhmp_criteria`} />
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
    path: '/local',
    name: 'Local Mitigation Planning',
    exact: true,
    mainNav: true,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: Submenus,
    component: connect(() => {}, {})(Local),
  },

  ...LocalCapabilities
]
