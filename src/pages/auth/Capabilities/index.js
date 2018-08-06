import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'

class Landing extends Component {
  render () {
   return (
      <div>
        The plan
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
