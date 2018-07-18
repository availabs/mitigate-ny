import React, { Component } from 'react';
import { connect } from 'react-redux';
import Element from 'components/light-admin/containers/Element'
import HazardList from './components/HazardList'
import HazardScoreTable from './components/HazardScoreTable'
import HazardMap from './components/HazardMap'

class Hazard extends Component {

  render () {
    return (
      	<Element>
      		<h6 className="element-header">New York Statewide Risk Index</h6>
          <div className='row'>
            <div className='col-7'>
      		    <HazardList display={'full'} size={12} dataType={'severeweather'}/>
            </div>
            <div className='col-lg-5'>
              <HazardScoreTable/>
            </div>
          </div>
           
          <div className='row'>
            <div className='col-lg-8'>
             {/* <HazardMap /> */}
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

