import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createMatchSelector } from 'react-router-redux'

import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'
import HazardList from './components/HazardList'
import HazardScoreTable from './components/HazardScoreTable'
import HazardMap from './components/HazardMap'

class Hazard extends Component {

  render () {
    const { params } = createMatchSelector({ path: '/risk-index/h/:hazard' })(this.props) || {}
    return (
      	<Element>
      		<h6 className="element-header">{params.hazard}</h6>
          <div className='row'>
            <ElementBox  title='Hazard Definition & Characteristics'>
            </ElementBox> 
          </div>
          <div className='row'>
            <div className='col-7'>
      		    <HazardList display={'full'} size={12} dataType={'severeWeather'}/>
            </div>
            <div className='col-lg-5'>
              <HazardScoreTable/>
            </div>
          </div>
           
          <div className='row'>
            <div className='col-lg-12'>
             <HazardMap />
            </div>
            
          </div>

      	</Element>
    )
  }
}

const mapDispatchToProps = { };

const mapStateToProps = state => {
  return {
    riskIndex: state.riskIndex,
    router: state.router
  };
};


export default [
  {
    path: '/risk-index/h/:hazard',
    subMenus: [],
    name: 'Risk Index',
    auth: true,
    breadcrumbs: [
      {name: 'RISK INDEX', path: '/risk-index'},
      {param: 'hazard', path: '/risk-index/h/'}
    ],
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    component: connect(mapStateToProps, mapDispatchToProps)(Hazard)
  }
]

