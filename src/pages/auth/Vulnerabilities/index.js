import React, { Component } from 'react';
import { connect } from 'react-redux';

import Element from 'components/light-admin/containers/Element'

import PopulationsTable from "./components/PopulationsTable.react"

class Vulnerabilities extends Component {
  render () {
    return (
      	<Element>
      		<h6 className="element-header">New York Statewide Populations</h6>
            <div className='row'>
              <div className='col-lg-12'>
                <PopulationsTable/>
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
    router: state.router
  };
};


export default [
  {
    icon: 'icon-map',
    path: '/vulnerabilities',
    name: 'Vulnerabilities',
    exact: true,
    mainNav: true,
    auth: true,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    breadcrumbs: [
      {name: 'Vulnerabilities', path: '/vulnerabilities'}
    ],
    component: connect(mapStateToProps, mapDispatchToProps)(Vulnerabilities)//,
    // subMenus: [[
    //   {name: 'By Hazard', path: '/risk-index/'},
    //   {name: 'By Geography', path: '/risk-index/g/36'},
    // ]]
  }
]
