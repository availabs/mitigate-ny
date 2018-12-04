import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import CapabilitiesTable from 'pages/auth/RiskIndex/components/CapabilitiesTable'
import subMenus from "./capabilities-submenu"


class Construction extends Component {
  render () {
   return (
      <div className='property-single'>

        <div className='property-info-w'>
          <div className="property-info-main" style={{paddingTop: 0, paddingBottom: 0}}>
        
            <div className="property-section">
              <Content content_id={`capabilities-construction`} />
              <CapabilitiesTable 
               title='Mitigation Construction Capabilities' 
               type="program"
               capability={'capability_construction'}
               columns={ ["name" , "description" , "agency" , "hazards" , 'admin' , 'url'] }
               filterColumns={ ["goal" , 'agency' , 'hazards' , 'admin'] }
               urlColumn="url"
               tableScroll={ true }
               tableLink="/capabilities/manage/new"
               tableLinkLabel="Add Your Agency Programs"
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
    path: '/capabilities/construction',
    name: 'Construction',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: subMenus,
    component: connect(() => ({}), {})(Construction),
  },
]
