import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import CapabilitiesTable from 'pages/auth/RiskIndex/components/CapabilitiesTable'
import subMenus from "./capabilities-submenu"


class HistoricEnvironmental extends Component {
  render () {
   return (
      <div className='property-single'>

        <div className='property-info-w'>
          <div className="property-info-main" style={{paddingTop: 0, paddingBottom: 0}}>
        
            <div className="property-section">
              <Content content_id={`capabilities-historic_evironmental_preservation`} />
               
            </div>

         
          </div>
         </div>
         <CapabilitiesTable 
         title='Historic and Environmental Preservation Capabilities' 
         type="program"
         capability={'capability_preservation' , 'capability_environmental'}/>
      </div>
    )
  }
}



export default [
  {
    icon: 'icon-map',
    path: '/capabilities/historicenvironmental',
    name: 'HistoricEnvironmental',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: subMenus,
    component: connect(() => {}, {})(HistoricEnvironmental),
  },
]
