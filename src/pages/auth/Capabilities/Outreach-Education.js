import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import CapabilitiesTable from 'pages/auth/RiskIndex/components/CapabilitiesTable'
import subMenus from "./capabilities-submenu"


class Outreach extends Component {
  render () {
   return (
      <div className='property-single'>

        <div className='property-info-w'>
          <div className="property-info-main" style={{paddingTop: 0, paddingBottom: 0}}>
        
            <div className="property-section">
              <Content content_id={`capabilities-education_outreach`} />
               <CapabilitiesTable 
               title='Outreach and Public Education Capabilities' 
               type="program"
               capability={'capability_outreach'}
               columns={ ["name" , "description" , "agency" , "hazards" , 'admin' , 'url'] }
               filterColumns={ ["goal" , 'agency' , 'hazards' , 'admin'] }
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
    path: '/capabilities/outreach',
    name: 'Outreach',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: subMenus,
    component: connect(() => {}, {})(Outreach),
  },
]
