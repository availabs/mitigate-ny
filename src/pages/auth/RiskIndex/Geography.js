import React, { Component } from 'react';
import { connect } from 'react-redux';
import Element from 'components/light-admin/containers/Element'
import HazardList from './components/HazardList'
import GeographyScoreTable from './components/GeographyScoreTable'
import HazardMap from './components/HazardMap'

class Hazard extends Component {

  render () {
    return (
      	<Element>
      		<h6 className="element-header">New York Statewide Risk Index</h6>
            <div className='row'>
              <div className='col-lg-12'>
                <GeographyScoreTable/>
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
    path: '/risk-index/g/:geoid',
    subMenus: [],
    name: 'Risk Index',
    auth: true,
    breadcrumbs: [
      {name: 'RISK INDEX', path: '/risk-index'},
      {param: 'geoid', path: '/risk-index/g/'}
    ],
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    component: connect(mapStateToProps, mapDispatchToProps)(Hazard)
  }
]
