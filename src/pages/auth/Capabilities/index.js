import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import AgencyList from './components/AgencyList'
import ProjectBox from 'components/light-admin/containers/ProjectBox'

class Landing extends Component {
  render () {
   return (
      <div className='property-single'>
         <div className='property-info-w'>
          <div className="property-info-main" style={{paddingBottom: 0}}>
            <div className="property-section">
              <Content content_id={`capabilities-overview`} />
            </div>
          </div>
        </div>
        <div className='property-info-w'>
          <div className="property-info-main">
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

        <AgencyList />
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
    component: connect(() => {}, {})(Landing),
  }
]
