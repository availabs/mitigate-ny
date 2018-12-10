import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import AgencyList from './components/AgencyList'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import subMenus from "./capabilities-submenu"

class MitigatingAgencies extends Component {
  render () {
   return (
      
      

      <div className='property-single'>
        <AgencyList />
      </div>
    )
  }
}



export default [
  {
    icon: 'icon-map',
    path: '/capabilities/agencies',
    name: 'Mitigating Agencies',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: subMenus,
    component: connect(() => ({}), {})(MitigatingAgencies),

  }
]
