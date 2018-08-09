import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'

class Landing extends Component {
  render () {
   return (
      <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main">
 
            <h1>Introduction</h1>
            
            <div className="property-section">
              <Content content_id={`section1-essentialterms`} />
            </div>
            
            <div className="property-section">
              <Content content_id={`section1-strategicframework`} />
            </div>

            <div className="property-section">
              <Content content_id={`section1-2019whatsnew`} />
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
    path: '/process',
    name: 'Planning Process',
    exact: true,
    mainNav: true,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    component: connect(() => {}, {})(Landing),
  }
]
