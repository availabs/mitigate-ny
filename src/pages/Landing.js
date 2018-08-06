import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'

class Landing extends Component {
  render () {
   return (
      <div>
        <Element>
          <h6 className="element-header">MITIGATE NY</h6>
          <div className='row'>
            <div className='col-6'>
              <Link to='/risk'>
                <ElementBox style={{height: '25vh', textAlign:'center', paddingTop: '14%'}}>
                  <h4 style={{color:'#047bf8'}}>Risk</h4>
                </ElementBox>
              </Link>
            </div>
            <div className='col-6'>
              <ElementBox style={{height: '25vh', textAlign:'center', paddingTop: '14%'}}>
                <h4 style={{color:'#ddd'}}>Hazards</h4>
              </ElementBox>
            </div>
          </div>
          <div className='row'>
            <div className='col-6'>
               <ElementBox style={{height: '25vh', textAlign:'center', paddingTop: '14%'}}>
                <h4 style={{color:'#ddd'}}>Projects & Capabilities</h4>
              </ElementBox>
            </div>
            <div className='col-6' >
               <ElementBox style={{height: '25vh', textAlign:'center', paddingTop: '14%'}}>
                <h4 style={{color:'#ddd'}}>Asset Inventory</h4>
              </ElementBox>
            </div>
          </div>
        </Element>          
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
	component: Landing
}