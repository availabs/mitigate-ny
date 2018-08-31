import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'


class Strategies extends Component {
  render () {
   return (
      <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main">
            
            <h1>Strategies</h1>
            

            
          </div>
           
        </div>
      </div>
    )
  }
}


export default [
  {
    icon: 'icon-map',
    path: '/strategies',
    name: 'Strategies',
    exact: true,
    mainNav: true,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    breadcrumbs: [
      {name: 'Strategies', path: '/strategies'}
    ],
    component: connect(() => {}, {})(Strategies),
  }
]
