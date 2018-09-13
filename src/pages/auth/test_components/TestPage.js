import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'

import NfipChoropleth from "pages/auth/Capabilities/components/NfipChoropleth"

class TestPage extends React.Component {

  // fetchFalcorDeps() {
  // }

  render() {
    try {
      return (
        <Element>

          <div className='row'>
            <div className='col-lg-12'>
              <ElementBox>
                <NfipChoropleth />
              </ElementBox>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-12'>
              <ElementBox>
                <NfipChoropleth attribute="total_loss"/>
              </ElementBox>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-12'>
              <ElementBox>
                <NfipChoropleth geoLevel="counties"/>
              </ElementBox>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-12'>
              <ElementBox>
                <NfipChoropleth attribute="total_loss"
                  geoLevel="counties"/>
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