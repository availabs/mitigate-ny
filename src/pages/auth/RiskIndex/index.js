import React, { Component } from 'react';
import { connect } from 'react-redux';
import Element from 'components/light-admin/containers/Element'
import HazardList from './components/HazardListNew'
import ElementBox from 'components/light-admin/containers/ElementBox'

class RiskIndex extends Component {

  render () {
    return (
	 
   <Element>
     <div className='row'>
        <div className='col-lg-12'>
          <ElementBox>
            <HazardList />
          </ElementBox>
        </div>
      </div>
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
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    breadcrumbs: [
      {name: 'hazard', path: '/hazards/'}
    ],
    component: connect(mapStateToProps, mapDispatchToProps)(RiskIndex),
  },
  {
    icon: 'icon-map',
    path: '/hazards/',
    name: 'Hazards',
    exact: true,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    breadcrumbs: [
      {name: 'hazard', path: '/hazards'}
    ],
    component: connect(mapStateToProps, mapDispatchToProps)(RiskIndex),
  }
]
