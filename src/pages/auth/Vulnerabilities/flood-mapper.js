import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import CapabilitiesTable from 'pages/auth/RiskIndex/components/CapabilitiesTable'
import Submenus from './risk-submenus'
import NfipTable from 'pages/auth/Capabilities/components/NfipTable'
import NfipChoropleth from 'pages/auth/Capabilities/components/NfipChoropleth'


class FloodplainMapper extends Component {
  render () {
   return (
      <div className='property-single'>

        <div className='property-info-w'>
          <div className="property-info-main" style={{paddingTop: 0, paddingBottom: 0}}>
        
            <div className="property-section">
              <Content content_id={`risk-floodplain_mapper`} />
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
    path: '/risk/floodmapper',
    name: 'floodmapper',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: Submenus,
    component: connect(() => {}, {})(FloodplainMapper),
  },
]
