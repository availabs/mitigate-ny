import React, { Component } from 'react';
import { connect } from 'react-redux';
import Element from 'components/light-admin/containers/Element'
import HazardList from './components/HazardList'

class RiskIndex extends Component {

  render () {
    return (
      	<Element>
      		<h6 className="element-header">New York Statewide Risk Index</h6>
      		<HazardList size={6} dataType={'severeWeather'}/>
      	</Element>
    )
  }
}

const mapDispatchToProps = { };

const mapStateToProps = state => {
  return {
    user: state.user,
    riskIndex: state.riskIndex,
    router: state.router
  };
};


export default [
  {
    icon: 'icon-map',
    path: '/hazards',
    name: 'Hazards',
    exact: true,
    mainNav: true,
    auth: true,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    breadcrumbs: [
      {name: 'hazard', path: '/risk-index'}
    ],
    component: connect(mapStateToProps, mapDispatchToProps)(RiskIndex),
  }
]
