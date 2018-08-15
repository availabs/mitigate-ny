
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'

class Home extends Component {
  render () {
   return (
      <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main">
          
            <div className="property-section">
              <Content content_id={`section1-essentialterms`} />
            </div>

            <div className="property-section">
              <Content content_id={`section1-strategicframework`} />
            </div>

             <div className="property-section">
              <Content content_id={`section2-glossary`} />
            </div>

          </div>           
        </div>
      </div>
    )
  }
}

export default {
	icon: 'icon-map',
	path: '/',
	exact: true,
	mainNav: true,
  title: '2019 New York State Hazard Mitigation Plan',
	name: 'Home',
	auth: false,
	component: Home
}