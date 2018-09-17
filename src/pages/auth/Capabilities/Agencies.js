import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import AgencyList from './components/AgencyList'
import ProjectBox from 'components/light-admin/containers/ProjectBox'

class Agencies extends Component {
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
    path: '/agencies',
    name: 'Agencies',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: [[
       {name: 'Agencies', path: '/agencies'},
       {name: 'Counties', path: '/counties'},
    ]],
    component: connect(() => {}, {})(Agencies),

  }
]
