import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import CapabilitiesTable from 'pages/auth/RiskIndex/components/CapabilitiesTable'
import subMenus from "./strategies-submenus"


class MitigationMeasures extends Component {
  render () {
   return (
    <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main">

            <div className="property-section">
              <Content content_id={`capabilities-mitigation_strategies`} />
              <CapabilitiesTable
                  columns={ ["name" , "description" , "hazards" , "goal"] }
                  title="Mitigation Measures"
                  filterColumns={ ["goal" , 'hazards'] }
                  expandColumns={ ["description"] }
                  tableScroll={ true }
                  type="measure"/>
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
    path: '/strategies/measures',
    name: 'Mitigation Measures',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: subMenus,
    component: MitigationMeasures,
  },
]
