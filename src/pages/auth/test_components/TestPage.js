import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'

import CountyCapabilitiesTable from "components/mitigate-ny/CountyCapabilitiesTable"

class TestPage extends React.Component {

  render() {
    try {
      return (
        <Element>

          <div className='row'>
            <div className='col-lg-12'>
              <ElementBox>
                <CountyCapabilitiesTable
                descriptions={ ['Economic Development Plan' , 'Post-Disaster Redevelopment Plan' , 'Hazard Mitigation Plan' , 'Coastal Erosion Hazard Area' , 'Coastal Zone Management Plan'] }/>

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