import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'

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

            <div className="property-section">
              <Content content_id={`section2-coordination_agency_departments`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-program_table`} />
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
