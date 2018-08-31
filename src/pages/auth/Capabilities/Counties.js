import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'

class Counties extends Component {
  render () {
   return (
      <div className='property-single'>
          <div className='property-info-w'>
            <div className="property-info-main" >
              <h1> County Capabilities </h1>
            </div>
        </div>
      </div>
    )
  }
}



export default [
  {
    icon: 'icon-map',
    path: '/counties',
    name: 'Counties',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: [[
       {name: 'Agencies', path: '/agencies'},
       {name: 'Counties', path: '/counties'},
    ]],
    component: connect(() => {}, {})(Counties),
  }
]
