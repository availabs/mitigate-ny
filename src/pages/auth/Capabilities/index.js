import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'

class Landing extends Component {
  render () {
   return (
      <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main">
            
            <div className="property-section">
              <Content content_id={`capabilities-2019_goals_objectives`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-whats_changed_2014`} />
            </div>

            <div className="property-section">
              <Content content_id={`section2-coordination_agency_departments`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-programs_table`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-mitigation_strategies_by_hazard`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-dhses_admin_plan`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-agency_administered_fundng_sources`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-local_fundng_sources`} />
            </div>

            <div className="property-section">
              <Content content_id={`section2-agency_stakeholder_responsible_for_implementation`} />
            </div>

            <div className="property-section">
              <Content content_id={`section7-integration_local_state_mitigation_efforts`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-submittal_review_process`} />
            </div>

            <div className="property-section">
              <Content content_id={`section7-funding_plans_projects`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-local_assets_table`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-hmgp`} />
            </div>

            <div className="property-section">
              <Content content_id={`capabilities-lhmp_stats_map`} />
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
    component: connect(() => {}, {})(Landing),
  }
]
