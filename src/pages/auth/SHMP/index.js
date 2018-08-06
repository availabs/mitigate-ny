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
            
            <h1>Planning Process</h1>
            
            <div className="property-section">
              <Content content_id={`section1-2019whatsnew`} />
            </div>

            <div className="property-section">
              <Content content_id={`section1-adoptionassurances`} />
            </div>

            <div className="property-section">
              <Content content_id={`section1-essentialterms`} />
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
    path: '/plan',
    name: 'Executive Summary',
    exact: true,
    mainNav: true,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    breadcrumbs: [
      {name: 'SHMP', path: '/plan'}
    ],
    component: connect(() => {}, {})(Landing),
  }
]
