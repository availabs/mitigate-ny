import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'

import ACS_Map from "components/mitigate-ny/ACS_Map"

class TestPage extends React.Component {

  render() {
    try {
      return (
        <Element>

          <div className='row'>
            <div className='col-lg-12'>
              <ElementBox>
                <ACS_Map geoLevel="tracts"
                  scaleType="quantile"
                  density={ true }/>
              </ElementBox>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-12'>
              <ElementBox>
                <ACS_Map variable="vulnerable"
                  geoLevel="tracts"
                  scaleType="quantile"
                  density={ true }/>
              </ElementBox>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-12'>
              <ElementBox>
                <ACS_Map />
              </ElementBox>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-12'>
              <ElementBox>
                <ACS_Map variable="vulnerable"/>
              </ElementBox>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-12'>
              <ElementBox>
                <ACS_Map variable="population_change"
                  geoLevel="tracts"
                  density={ true }
                  range={ ["#d7191c","#fdae61","#ffffbf","#a6d96a","#1a9641"] }
                  scaleType="quantile"/>
              </ElementBox>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-12'>
              <ElementBox>
                <ACS_Map variable="population_change"
                  range={ ["#d7191c","#fdae61","#ffffbf","#a6d96a","#1a9641"] }
                  scaleType="quantile"/>
              </ElementBox>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-12'>
              <ElementBox>
                <ACS_Map 
                  variable="population_change"
                  geoLevel= "tracts"
                  scaleType="quantile"
                  density= {true}
                  />
              </ElementBox>
            </div>
          </div>

        </Element>
      )
    }
    catch (e) {
      return (
        <Element>
          <ElementBox>
            There was an error...
          </ElementBox>
          <ElementBox style={ { color: "red" } }>
            { e.message }
          </ElementBox>
        </Element>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    router: state.router
  };
};

const mapDispatchToProps = {};

export default [
  {
    path: '/test',
    exact: true,
    name: 'Test Page',
    mainNav: false,
    breadcrumbs: [
    	{ name: 'Test Page', path: '/test' }
    ],
    menuSettings: { image: 'none', scheme: 'color-scheme-light' },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(TestPage))
  }
]