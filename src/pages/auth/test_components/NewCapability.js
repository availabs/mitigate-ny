import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import { createMatchSelector } from 'react-router-redux';

import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'

import {
  sendSystemMessage
} from 'store/modules/messages';

import {
  getHazardName
} from 'utils/sheldusUtils';

import {
  ATTRIBUTES,
  NEW_CAPABILITY_ATTRIBUTES,
  receiveHazards,
  setCapabilityData,
  getDefaultValue,
  getLabel,
  clearCapabilityData,
  updateCapability
} from "store/modules/capabilities"

import "./components/capabilities.css"

const FormRow = ({ type="text", id, placeholder, value, onChange }) =>
  <div className="form-group row">
    <label htmlFor={ id } className="col-form-label col-sm-3">{ getLabel(id) }</label>
    <div className="col-sm-9">
      { type === "textarea" ?
        <textarea id={ id }
          className="form-control"
          placeholder={ placeholder }
          onChange={ onChange }
          value={ value || "" }/>
        :
        <input type={ type } id={ id }
          className="form-control"
          placeholder={ placeholder }
          onChange={ onChange }
          value={ value || "" }/>
      }
    </div>
  </div>

const CheckGroup = ({ type="checkbox", onChange, checks, name=null, label=getLabel }) => {
  const variables = checks.reduce((a, c) => a.concat(...c.map(d => d.id)), []);
  return (
    <div className="form-group row">
      <div className="col-sm-2"/>
      {
        checks.map((group, i) =>
          <div className="col-sm-5" key={ i }>
            {
              group.map(d =>
                <div className="form-check" key={ d.id }>
                  <label className="form-check-label">
                    <input type={ type } className="form-check-input"
                      checked={ d.checked || false } onChange={ e => onChange(e, variables) }
                      id={ d.id } name={ name }/>
                    { label(d.id) }
                  </label>
                </div>
              )
            }
          </div>
        )
      }
    </div>
  )
}

class Accordion extends React.Component {
  state = {
    opened: false
  }
  toggle() {
    const opened = !this.state.opened;
    this.setState({ opened });
  }
  render() {
    const { opened } = this.state;
    return (
      <div className="accordion-container">
        <div onClick={ this.toggle.bind(this) }
          className={ `accordion-header ${ this.state.opened ? "opened" : "" }` }>
          <h5 style={ { marginBottom: 0 } }>{ this.props.title }</h5>
        </div>
        <div style={ { overflowY: "auto", overflowX: "hidden", height: opened ? "auto" : 0, padding: "0px 10px 0px 10px" } }>
          { this.props.children }
        </div>
      </div>
    )
  }
}

class NewCapability extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      ...props.capabilities.capabilityData
    }
  }

  fetchFalcorDeps() {
    const { params } = createMatchSelector({ path: '/test/capabilities/edit/:id' })(this.props) || { params: {} },
      { id } = params;
    return this.props.falcor.get(
      ['riskIndex', 'hazards']
    )
    .then(response => {
      const hazards = response.json.riskIndex.hazards;
      this.props.receiveHazards(hazards);
      return hazards;
    })
    .then(hazards => {
      return this.props.falcor.get(
        ['riskIndex', 'meta', hazards, 'name']
      )
    })
    .then(() => {
      if (!id) {
        this.props.clearCapabilityData();
        return;
      }
      return this.props.falcor.get(
        ['capabilities', 'byId', id, ATTRIBUTES]
      )
      .then(response => {
        const graph = response.json.capabilities.byId[id],
          capability = {}
        ATTRIBUTES.forEach(attribute => {
          capability[attribute] = graph[attribute];
        })
        this.setState(capability);
      })
    })
  }

  getHazardName(hazard) {
    try {
      return this.props.riskIndex.meta[hazard].name;
    }
    catch (e) {
      return getHazardName(hazard);
    }
  }

  onChange(e) {
    this.setState({ ...this.state, [e.target.id]: e.target.value });
  }
  radios(e, variables) {
    const status = {}
    variables.forEach(variable => status[variable] = false);
    status[e.target.id] = e.target.checked;
    this.setState({ ...this.state, ...status })
  }
  checkbox(e) {
    this.setState({ ...this.state, [e.target.id]: e.target.checked });
  }
  hazards(e) {
    const hazard = e.target.id;
    let hazards = this.state.hazards;
    if (hazards && hazards.includes(e.target.id)) {
      hazards = hazards.filter(h => h !== e.target.id);
    }
    else if (hazards) {
      hazards.push(e.target.id);
    }
    else {
      hazards = [hazard];
    }
    this.setState({ hazards });
  }
  selectAllHazards() {
    this.setState({ hazards: this.props.capabilities.hazards })
  }
  deselectAllHazards() {
    this.setState({ hazards: [] })
  }
  onSubmit(e) {
    e.preventDefault();

    const {
      id,
      name
    } = this.state;

    if (id !== null) {
      const data = { ...this.state },
        { hazards } = data;
      data.hazards = { $type: "atom", value: hazards };
      return this.props.falcor.set({
        paths: [
          ['capabilities', 'byId', id, ATTRIBUTES]
        ],
        jsonGraph:{
          capabilities: {
              byId: {
                [id]: {
                  ...data
                }
              }
            }
          }
      })
      .then(response => {
        const graph = response.json.capabilities.byId[id],
          capability = {};
        ATTRIBUTES.forEach(attribute => {
          capability[attribute] = graph[attribute];
        })
        this.props.updateCapability(capability);
        this.props.sendSystemMessage(`Capability "${ name }" was successfully edited.`, { type: "success" });
      })
    }
    else {
      const args = NEW_CAPABILITY_ATTRIBUTES.map(attribute => {
        if (attribute === "hazards") {
          return { $type: "atom", value: this.state.hazards || getDefaultValue(attribute) };
        }
        return this.state[attribute] || getDefaultValue(attribute)
      })
      return this.props.falcor.call(
        ['capabilities', 'insert'],
        args, [], []
      )
      .then(response => {
        this.props.sendSystemMessage(`Capability "${ name }" was successfully created.`, { type: "success" });
      })
    }
  }

  render() {
    const {
        id,
        name,
        description,
        contact,
        contact_email,
        contact_title,
        contact_department,
        agency,
        partners,
        status_new_shmp,
        status_carryover_shmp,
        status_in_progess,
        status_on_going,
        status_unchanged,
        status_completed,
        status_discontinued,
        admin_statewide,
        admin_regional,
        admin_county,
        admin_local,
        file_type_shp,
        file_type_lat_lon,
        file_type_address,
        file_type_not_tracked,
        budget_provided,
        primary_funding,
        secondary_funding,
        num_staff,
        num_contract_staff,
        hazards,
        capability_mitigation,
        capability_preparedness,
        capability_response,
        capability_recovery,
        capability_climate,
        capability_critical,
        capability_preservation,
        capability_environmental,
        capability_risk_assessment,
        capability_administer_funding,
        capability_funding_amount,
        capability_tech_support,
        capability_construction,
        capability_outreach,
        capability_project_management,
        capability_research,
        capability_policy,
        capability_regulatory,
        related_policy,
        url,
        goal,
        objective
      } = this.state,
      title = (id === null) ? "New Capability" : "Edit Capability";
    return (
      <Element>
        <h6 className="element-header">{ title }</h6>
        <div className="row">
          <div className="col-sm-3"/>
          <div className="col-sm-6">
            <ElementBox>
              <form onSubmit={ this.onSubmit.bind(this) }>

                <FormRow id="name"
                    placeholder="Enter a name..."
                    value={ name }
                    onChange={ this.onChange.bind(this) }/>

                <FormRow id="description" type="textarea"
                    placeholder="Enter a description..."
                    value={ description }
                    onChange={ this.onChange.bind(this) }/>

                <FormRow id="url"
                    placeholder="Enter a url..."
                    value={ url }
                    onChange={ this.onChange.bind(this) }/>

                <Accordion title="Contact Information">
                  <FormRow id="contact"
                      placeholder="Enter a contact..."
                      value={ contact }
                      onChange={ this.onChange.bind(this) }/>
                  <FormRow id="contact_email"
                      placeholder="Enter contact's email..."
                      value={ contact_email }
                      onChange={ this.onChange.bind(this) }/>
                  <FormRow id="contact_title"
                      placeholder="Enter contact's title..."
                      value={ contact_title }
                      onChange={ this.onChange.bind(this) }/>
                  <FormRow id="contact_department"
                      placeholder="Enter contact's department..."
                      value={ contact_department }
                      onChange={ this.onChange.bind(this) }/>
                  <FormRow id="agency"
                      placeholder="Enter agency..."
                      value={ agency }
                      onChange={ this.onChange.bind(this) }/>
                  <FormRow id="partners"
                      placeholder="Enter partners..."
                      value={ partners }
                      onChange={ this.onChange.bind(this) }/>

                </Accordion>

                <Accordion title="Budget Information">
                  <FormRow id="budget_provided"
                      placeholder="Enter a budget..."
                      value={ budget_provided }
                      onChange={ this.onChange.bind(this) }/>
                  <FormRow id="primary_funding"
                      placeholder="Enter primary funding..."
                      value={ primary_funding }
                      onChange={ this.onChange.bind(this) }/>
                  <FormRow id="secondary_funding"
                      placeholder="Enter secondary funding..."
                      value={ secondary_funding }
                      onChange={ this.onChange.bind(this) }/>
                  <FormRow id="num_staff"
                      type="number"
                      value={ num_staff }
                      onChange={ this.onChange.bind(this) }/>
                  <FormRow id="num_contract_staff"
                      type="number"
                      value={ num_contract_staff }
                      onChange={ this.onChange.bind(this) }/>
                </Accordion>

                <Accordion title="Hazards">
                  <div className="form-group row">
                    <div className="col-sm-2"/>
                    <div className="col-sm-5">
                      <button className="btn btn-sm btn-outline-success"
                        onClick={ this.selectAllHazards.bind(this) }
                        type="button">
                        Select All
                      </button>
                    </div>
                    <div className="col-sm-5">
                      <button className="btn btn-sm btn-outline-danger"
                        onClick={ this.deselectAllHazards.bind(this) }
                        type="button">
                        Deselect All
                      </button>
                    </div>
                  </div>
                  <CheckGroup onChange={ this.hazards.bind(this) }
                    label={ this.getHazardName.bind(this) }
                    checks={
                      [
                        this.props.capabilities.hazards.slice(0, 9).map(hazard =>
                          ({ id: hazard, checked: hazards && hazards.includes(hazard) })
                        ),
                        this.props.capabilities.hazards.slice(9).map(hazard =>
                          ({ id: hazard, checked: hazards && hazards.includes(hazard) })
                        )
                      ]
                    }/>
                </Accordion>

                <Accordion title="Status">
                  <CheckGroup onChange={ this.checkbox.bind(this) }
                    checks={
                      [[
                        { id: "status_new_shmp", checked: status_new_shmp },
                        { id: "status_carryover_shmp", checked: status_carryover_shmp },
                        { id: "status_in_progess", checked: status_in_progess },
                        { id: "status_on_going", checked: status_on_going }
                      ],
                      [
                        { id: "status_unchanged", checked: status_unchanged },
                        { id: "status_completed", checked: status_completed },
                        { id: "status_discontinued", checked: status_discontinued },
                      ]]
                    }/>
                </Accordion>

                <Accordion title="Administration">
                  <CheckGroup onChange={ this.checkbox.bind(this) }
                    checks={
                      [[
                        { id: "admin_statewide", checked: admin_statewide },
                        { id: "admin_regional", checked: admin_regional },
                        { id: "admin_county", checked: admin_county },
                        { id: "admin_local", checked: admin_local }
                      ]]
                    }/>
                </Accordion>

                <Accordion title="Capabilities">
                  <CheckGroup onChange={ this.checkbox.bind(this) }
                    checks={
                      [[
                        { id: "capability_mitigation", checked: capability_mitigation },
                        { id: "capability_preparedness", checked: capability_preparedness },
                        { id: "capability_response", checked: capability_response },
                        { id: "capability_recovery", checked: capability_recovery },
                        { id: "capability_climate", checked: capability_climate },
                        { id: "capability_critical", checked: capability_critical },
                        { id: "capability_preservation", checked: capability_preservation },
                        { id: "capability_environmental", checked: capability_environmental },
                        { id: "capability_risk_assessment", checked: capability_risk_assessment },
                      ],
                      [
                        { id: "capability_administer_funding", checked: capability_administer_funding },
                        { id: "capability_funding_amount", checked: capability_funding_amount },
                        { id: "capability_tech_support", checked: capability_tech_support },
                        { id: "capability_construction", checked: capability_construction },
                        { id: "capability_outreach", checked: capability_outreach },
                        { id: "capability_project_management", checked: capability_project_management },
                        { id: "capability_research", checked: capability_research },
                        { id: "capability_policy", checked: capability_policy },
                        { id: "capability_regulatory", checked: capability_regulatory }
                      ]]
                    }/>
                </Accordion>

                <Accordion title="File Type">
                  <CheckGroup onChange={ this.radios.bind(this) }
                    type="radio" name={ "file-type" }
                    checks={
                      [[
                        { id: "file_type_shp", checked: file_type_shp },
                        { id: "file_type_lat_lon", checked: file_type_lat_lon },
                        { id: "file_type_address", checked: file_type_address },
                        { id: "file_type_not_tracked", checked: file_type_not_tracked }
                      ]]
                    }/>
                </Accordion>

                <FormRow id="related_policy"
                    placeholder="Enter related policy..."
                    value={ related_policy }
                    onChange={ this.onChange.bind(this) }/>

                <FormRow id="goal"
                    placeholder="Enter goal..."
                    value={ goal }
                    onChange={ this.onChange.bind(this) }/>

                <FormRow id="objective"
                    placeholder="Enter objective..."
                    value={ objective }
                    onChange={ this.onChange.bind(this) }/>

                <div className="form-buttons-w">
                  <button className="btn btn-primary">Submit</button>
                </div>

              </form>
            </ElementBox>
          </div>
        </div>
      </Element>
    )
  }
}

const mapStateToProps = state => ({
  router: state.router,
  capabilitiesGraph: state.graph.capabilities,
  capabilities: state.capabilities,
  riskIndex: state.graph.riskIndex
})

const mapDispatchToProps = {
  sendSystemMessage,
  setCapabilityData,
  receiveHazards,
  clearCapabilityData,
  updateCapability
};

export default [
  {
    path: '/test/capabilities/new',
    name: 'Capabilities',
    mainNav: false,
    breadcrumbs: [
      { name: 'Capabilities', path: '/test/capabilities' },
      { name: 'New Capability', path: '/test/capabilities/new' }
    ],
    menuSettings: { image: 'none', scheme: 'color-scheme-light' },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(NewCapability))
  },
  {
    path: '/test/capabilities/edit/:id',
    name: 'Capabilities',
    mainNav: false,
    breadcrumbs: [
      { name: 'Capabilities', path: '/test/capabilities' },
      { param: 'id', path: '/test/capabilities/edit/edit/' }
    ],
    menuSettings: { image: 'none', scheme: 'color-scheme-light' },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(NewCapability))
  }
]