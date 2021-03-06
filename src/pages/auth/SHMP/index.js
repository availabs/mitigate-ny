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
            
            <h1>2019 New York State Hazard Mitigation Plan</h1>
            

            
          </div>
           
        </div>
      </div>
    )
  }
}


export default [
  {
    icon: 'icon-map',
    path: '/plan',
    name: 'Executive Summary',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    breadcrumbs: [
      {name: 'SHMP', path: '/plan'}
    ],
    component: connect(() => {}, {})(Landing),
  }
]
