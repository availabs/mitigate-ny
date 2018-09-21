import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import CapabilitiesTable from 'pages/auth/RiskIndex/components/CapabilitiesTable'
import subMenus from "./capabilities-submenu"


class ProjectManagement extends Component {
  render () {
   return (
    <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main">

           

            <div className="property-section">
              <Content content_id={`capabilities-project_management`} />
               <CapabilitiesTable title='Project Management Capabilities' capability={'capability_project_management'}/>
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
    path: '/projectmanagement',
    name: 'ProjectManagement',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: subMenus,
    component: connect(() => {}, {})(ProjectManagement),
  },
]
