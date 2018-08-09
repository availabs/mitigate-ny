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
            
            <h1>Agencies</h1>
            <h1>Counties></h1>
    
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
