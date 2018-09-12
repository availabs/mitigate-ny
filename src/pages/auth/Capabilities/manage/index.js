import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'

import FilterPanel from "./components/CapabilitiesFilterPanel"
import CapabilitiesPanel from "./components/CapabilitiesPanel"

import {
  ATTRIBUTES,
  receiveCapabilities,
  receiveHazards,
  receiveAgencies
} from "store/modules/capabilities"

import "./components/capabilities.css"

const Capability = ({ id, name, description }) =>
  <ElementBox key={ id }>
    <h6>{ name }</h6>
    <div>{ description }</div>
  </ElementBox>

// STOP THE MADNESS!!!;

class CapabilitiesIndex extends React.Component {

  componentDidMount() {
    this.fetchFalcorDeps();
  }

  fetchFalcorDeps() {
    return this.props.falcor.get(
      ['capabilities', 'length'],
      ['riskIndex', 'hazards']
    )
    .then(response => {
      const hazards = response.json.riskIndex.hazards;
      this.props.receiveHazards(hazards);
      return this.props.falcor.get(
        ['riskIndex', 'meta', hazards, 'name']
      )
      .then(() => response.json.capabilities.length)
    })
    .then(length => this.props.falcor.get(
        ['capabilities', 'byIndex', { from: 0, to: length -1 }, 'id']
      )
      .then(response => {
        const ids = [];
        for (let i = 0; i < length; ++i) {
          const graph = response.json.capabilities.byIndex[i]
          if (graph) {
            ids.push(graph.id);
          }
        }
        return ids;
      })
    )
    .then(ids =>
      this.props.falcor.get(
        ['capabilities', 'byId', ids, ATTRIBUTES]
      )
      .then(response => {
        const capabilities = [],
          agencies = {};
        ids.forEach(id => {
          const graph = response.json.capabilities.byId[id],
            capability = {
              id
            };
            ATTRIBUTES.forEach(attribute => {
              capability[attribute] = graph[attribute];
            })
            if (graph.agency) {
              agencies[graph.agency] = true;
            }
          capabilities.push(capability);
        })
        this.props.receiveAgencies(Object.keys(agencies));
        this.props.receiveCapabilities(capabilities);
      })
    )
  }

  deleteCapability(id) {
    return this.props.falcor.call(
        ["capabilities", "remove"],
        [id]
    ).then(() => this.fetchFalcorDeps());
  }

  render() {
    return (
      <Element>
        <h6 className="element-header">Capabilities Management</h6>
        <div className="row">

          <FilterPanel className="col-3"/>

          <CapabilitiesPanel className="col-9"
            deleteCapability={ this.deleteCapability.bind(this) }/>

        </div>
      </Element>
    )
  }
}

const mapStateToProps = state => ({
  router: state.router,
  capabilities: state.capabilities.capabilities
})

const mapDispatchToProps = {
  receiveCapabilities,
  receiveHazards,
  receiveAgencies
};

export default [
  {
    path: '/capabilities/manage',
    exact: true,
    name: 'Capabilities Management',
    auth: true,
    mainNav: false,
    breadcrumbs: [
      { name: 'Capabilities', path: '/capabilities/manage' }
    ],
    subMenus: [],
    menuSettings: { image: 'none', scheme: 'color-scheme-light' },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CapabilitiesIndex))
  }
]