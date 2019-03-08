import React, { Component } from 'react';
import { connect } from 'react-redux';

import AgencyList from './components/AgencyList'
import subMenus from "./capabilities-submenu"
import SideNav from './components/SideNav'




class MitigatingAgencies extends Component {
 
  render () {
    let navItems = Object.keys(this.props.agencies).map(d => {
      let link = '/capabilities/agencies/' + d 
      let val = this.props.agencies[d]
      val.to = link
      val.id = d
      return val 
    })

    return (
      <div className='property-single'>
        <div className='property-info-w' style={{maxWidth: 1550}}>
          <SideNav items={navItems} title={'Mitigating Agencies'}/>
          <AgencyList />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
    agencies: state.agencies.meta
})


export default [
  {
    icon: 'icon-map',
    path: '/capabilities/agencies',
    name: 'Mitigating Agencies',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: subMenus,
    component: connect(mapStateToProps, {})(MitigatingAgencies),

  }
]
