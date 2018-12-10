import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import AgencyList from './components/AgencyList'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import CapabilitiesSummaryTable from "components/mitigate-ny/CapabilitiesSummaryTable"

class Agencies extends Component {
  render () {
   return (
      <div className='property-single'>
        <CapabilitiesSummaryTable
              title= "Statewide Programs Summary by Agency"
              groupBy= "agency"
              columns= {["programs",
                        "capabilities",
                        "goals",
                        "regional",
                        "hazards",
                        "statewide",
                        "local"]}
            filterBy= "program"
            pageSize= { 9 }
            />
        <AgencyList />
      </div>
    )
  }
}



export default [
  {
    icon: 'icon-map',
    path: '/capabilities/agencies',
    name: 'Agencies',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: [[
       {name: 'Agencies', path: '/capabilities/agencies'},
       {name: 'Counties', path: '/counties'},
    ]],
    component: connect(() => ({}), {})(Agencies),
  }
]
