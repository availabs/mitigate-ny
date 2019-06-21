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
  getInstructions,
  PRIORITY_META_DATA,
  receiveHazards,
  setCapabilityData,
  getDefaultValue,
  getLabel,
  clearCapabilityData,
  updateCapability,
  JUSTIFICATION_META,
  getJustificationLabel,
  GOAL_METADATA
} from "store/modules/capabilities"

import "./components/capabilities.css"

const FormRow = ({ type="text", id, placeholder, value, onChange=null, instructions=getInstructions, dollar=false, percent=false, readonly=false }) =>
  <div className="form-group row">
    <label htmlFor={ id } className="col-form-label col-sm-3">{ getLabel(id) }</label>
    <div className="input-group col-sm-9">
      { !dollar ? null :
        <div className="input-group-prepend">
          <div className="input-group-text">$</div>
        </div>
      }
      { type === "textarea" ?
        <textarea id={ id }
          className="form-control"
          placeholder={ placeholder }
          onChange={ onChange }
          value={ value || "" }
          disabled={ readonly }/>
        :
        <input type={ type } id={ id }
          className="form-control"
          placeholder={ placeholder }
          onChange={ onChange }
          value={ value || "" }
          disabled={ readonly }/>
      }
      { !percent ? null :
        <div className="input-group-append">
          <div className="input-group-text">%</div>
        </div>
      }
    </div>
    { !instructions(id) ? null :
      <div className="col-sm-3"/>
    }
    { !instructions(id) ? null :
      <div className="col-sm-9 row-instructions">
        { instructions(id) }
      </div>
    }
  </div>

// //

const CheckGroup = ({ type="checkbox", onChange, checks, name=null, label=getLabel, header=null, instructions=null, labelFunc=null, large=false }) =>
  <div className="form-group row">
    { header === null ?
      <div className="col-sm-2"/> :
      <div className="col-sm-3">
        { header }
      </div>
    }
    
    {
      checks.map((group, i) =>
        <div className={ large ? "col-sm-8" : "col-sm-5" } key={ i }>
          {
            group.map(d => {
              const variables = checks
                .reduce((a, c) => a.concat(...c.filter(g => d.name === g.name).map(d => d.id)), [])
              return (
                <div className="form-check" key={ d.id }>
                  <label className="form-check-label">
                    <input type={ type } className="form-check-input"
                      checked={ d.checked || false } onChange={ e => onChange(e, variables) }
                      id={ d.id } name={ d.name || name }/>
                    { labelFunc ? labelFunc(d) : label(d.id) }
                  </label>
                </div>
              )
            })
          }
        </div>
      )
    }
    { !instructions ? null :
      <div className="col-sm-12"/>
    }
    { !instructions ? null :
      header === null ?
        <div className="col-sm-2"/> :
        <div className="col-sm-3"/>
    }
    {
      !instructions ? null :
      header === null ?
        <div className="col-sm-10 row-instructions">
          { instructions }
        </div> :
        <div className="col-sm-9 row-instructions">
          { instructions }
        </div>
    }
  </div>

// //

const PriorityRow = ({ onChange, id, value }) =>
  <div className="form-group row">
    <div className="col-sm-2"/>
    <div className="col-sm-8">
      {
        Object.keys(PRIORITY_META_DATA[id]).sort((a, b) => b - a).map(key => {
          return <div className="form-check" key={ key }>
            <label className="form-check-label">
              <input type="radio" className="form-check-input"
                checked={ key == value } onChange={ e => onChange(id, key) }
                name={ id }/>
              ({ key }) { getLabel(id, key) }
            </label>
          </div>
        })
      }
    </div>
  </div>

// //

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
          {
            !this.props.instructions ? null :
            <div className="accordion-instructions">
              { this.props.instructions }
            </div>
          }
          { this.props.children }
        </div>
      </div>
    )
  }
}

// //

class GoalAccordion extends React.Component {
  render() {
    const {
      onChange,
      goal=""
    } = this.props;
    return (
      <Accordion title={ getLabel("goal") }>
        <div className="accordion-instructions">
                      { getInstructions("goal") }
            </div>
        {
          GOAL_METADATA.map((group, i) =>
            <div className="form-group row" key={ i }>
              <div className="col-sm-1"/>
              <div className="col-sm-11">

                <CheckGroup name={ group.cat }
                  labelFunc={ d => <span><b>{ d.id }</b> { d.desc }</span> }
                  header={ group.cat }
                  onChange={ onChange }
                  large={ true }
                  checks={[
                    group.goals.map(g => ({
                      id: g.goal,
                      checked: goal.includes(g.goal),
                      desc: g.desc
                    }))
                  ]}/>

              </div>
            </div>
            
          )
        }
      </Accordion>
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
    const { params } = createMatchSelector({ path: '/capabilities/manage/edit/:id' })(this.props) || { params: {} },
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
    let hazards = this.state.hazards ? this.state.hazards.split("|") : [];
    if (hazards.length && hazards.includes(e.target.id)) {
      hazards = hazards.filter(h => h !== e.target.id);
    }
    else if (hazards.length) {
      hazards.push(e.target.id);
    }
    else {
      hazards = [hazard];
    }
    this.setState({ hazards: hazards.join("|") });
  }
  selectAllHazards() {
    this.setState({ hazards: this.props.capabilities.hazards.join("|") })
  }
  deselectAllHazards() {
    this.setState({ hazards: "" })
  }
  setPriority(id, value) {
    this.setState({ [id]: +value });
  }
  setType(e) {
    if (e.target.checked) {
      this.setState({ type: e.target.id })
    }
    else {
      this.setState({ type: null })
    }
  }
  updateGoal(e) {
    console.log("UPDATE GOAL", e.target.id)
    let goal = this.state.goal.split("|").filter(d => Boolean(d));
    if (goal.includes(e.target.id)) {
      goal = goal.filter(d => d !== e.target.id);
    }
    else {
      goal.push(e.target.id);
    }
    this.setState({ goal: goal.join("|") });
  }
  updateJustifications(e) {
    let justification = this.state.justification.split("|").filter(d => Boolean(d));
    if (e.target.checked) {
      justification.push(e.target.id);
    }
    else {
      justification = justification.filter(d => d !== e.target.id);
    }
    this.setState({ justification: justification.join("|") });
  }
  onSubmit(e) {
    e.preventDefault();

    const {
      id,
      name
    } = this.state;

    if (!name) {
      this.props.sendSystemMessage(`Missing required parameter: name.`);
      return;
    }

    const data = { ...this.state };

    if (data.type !== 'action') {
      data.priority_1 = 0;
      data.priority_2 = 0;
      data.priority_3 = 0;
      data.priority_4 = 0;
      data.priority_5 = 0;
      data.priority_6 = 0;
      data.priority_7 = 0;
    }
    data.priority_total = data.priority_1 + 
                          data.priority_2 +
                          data.priority_3 +
                          data.priority_4 +
                          data.priority_5 +
                          data.priority_6 +
                          data.priority_7;
    for (const attribute in data) {
      data[attribute] = data[attribute] || getDefaultValue(attribute)
    }
    if (id !== null) {
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
        return data[attribute] || getDefaultValue(attribute)
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
        status_proposed,

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
        hazards="",
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

        funding_amount,
        funding_received,

        capability_tech_support,
        capability_construction,
        capability_outreach,
        capability_project_management,
        capability_research,
        capability_policy,
        capability_regulatory,
        capability_resiliency,

        priority_1,
        priority_2,
        priority_3,
        priority_4,
        priority_5,
        priority_6,
        priority_7,

        related_policy,
        url,
        goal="",
        objective,

        type,

        municipality,
        county,

        benefit_cost_analysis,
        engineering_required,
        engineering_complete,

        repetitive_loss,

        origin_plan_name,
        origin_plan_year,

        design_percent_complete,
        scope_percent_complete,

        start_date,
        completed_date,

        justification="",
      } = this.state,
      title = (id === null) ? "Add New Program, Measure, or Action Below" : "Edit Program, Measure, or Action";

    const JUSTIFICATIONS = Object.keys(JUSTIFICATION_META)
    let hazardList = this.props.capabilities.hazards.sort()
    console.log('hazardList', hazardList)

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

                <CheckGroup type="radio" name="type" header={ getLabel("type") }
                  onChange={ this.setType.bind(this) }
                  label={ d => d.split("").map((d, i) => i === 0 ? d.toUpperCase() : d).join("") }
                  checks={[
                      [{ id: "program", checked: type === "program" },
                      { id: "measure", checked: type === "measure" },
                      { id: "action", checked: type === "action" }]
                    ]
                  }/>

                
                { type !== "action" ? null :
                  <FormRow id="county"
                    placeholder="Enter a county..."
                    value={ county }
                    onChange={ this.onChange.bind(this) }/>
                }

                { type !== "action" ? null :
                  <FormRow id="municipality"
                    placeholder="Enter a municipality..."
                    value={ municipality }
                    onChange={ this.onChange.bind(this) }/>
                }

                { type === "measure" ? null :
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
                }

                { type !== "action" ? null :
                  <Accordion title="Status">

            
                <FormRow id="start_date" type="date"
                  value={ start_date }
                  onChange={ this.onChange.bind(this) }/>
             

               
                <FormRow id="completed_date" type="date"
                  value={ completed_date }
                  onChange={ this.onChange.bind(this) }/>

                  <FormRow id="origin_plan_name"
                    placeholder="Enter origin plan name..."
                    value={ origin_plan_name }
                    onChange={ this.onChange.bind(this) }/>

                  <FormRow id="origin_plan_year"
                    placeholder="Enter origin plan year..."
                    value={ origin_plan_year } type="number"
                    onChange={ this.onChange.bind(this) }/>

                

                    <CheckGroup onChange={ this.radios.bind(this) } type="radio"
                      checks={
                        [[
                          { id: "status_unchanged", checked: status_unchanged, name: "status" },
                          { id: "status_completed", checked: status_completed, name: "status" },
                          { id: "status_discontinued", checked: status_discontinued, name: "status" },
                          { id: "status_in_progess", checked: status_in_progess, name: "status" },
                          { id: "status_on_going", checked: status_on_going, name: "status" },
                          { id: "status_proposed", checked: status_proposed, name: "status" }
                        ].filter(d => type === "program" ? true : d.id !== "status_on_going")]
                      }/>

                    <div className="accordion-instructions">
                      { getInstructions("justification") }
                    </div>

                    { !(status_unchanged || status_discontinued) ? null :
                      <CheckGroup onChange={ this.updateJustifications.bind(this) }
                        label={ getJustificationLabel }
                        checks={
                          [ 
                            JUSTIFICATIONS.slice(0, Math.ceil(JUSTIFICATIONS.length * 0.5))
                              .map(id => ({ id, checked: justification.includes(id) })),
                            JUSTIFICATIONS.slice(Math.ceil(JUSTIFICATIONS.length * 0.5))
                              .map(id => ({ id, checked: justification.includes(id) }))
                          ]
                        }/>
                    }

                  </Accordion>
                }
                    
                { type !== "action" ? null :
                  !(status_in_progess || status_unchanged || status_proposed) ? null :
                  <FormRow id="design_percent_complete" type="number"
                    placeholder="Enter percent completed..."
                    value={ design_percent_complete } percent={ true }
                    onChange={ this.onChange.bind(this) }/>
                }
                      
                { type !== "action" ? null :
                  !(status_in_progess || status_unchanged || status_proposed) ? null :
                  <FormRow id="scope_percent_complete" type="number"
                    placeholder="Enter percent completed..."
                    value={ scope_percent_complete } percent={ true }
                    onChange={ this.onChange.bind(this) }/>
                }

                <Accordion title="Budget Information">
                  { type === "measure" ? null :
                    <FormRow id="budget_provided" type="number"
                        placeholder="Enter budget provided..."
                        value={ budget_provided } dollar={ true }
                        onChange={ this.onChange.bind(this) }/>
                  }
                  { type !== "action" ? null :
                    <FormRow id="funding_received" type="number"
                        placeholder="Enter funding received..."
                        value={ funding_received } dollar={ true }
                        onChange={ this.onChange.bind(this) }/>
                  }
                  { !capability_administer_funding ? null :
                    <FormRow id="funding_amount" type="number"
                        placeholder="Enter funding administered..."
                        value={ funding_amount } dollar={ true }
                        onChange={ this.onChange.bind(this) }/>
                  }
                  <FormRow id="primary_funding"
                      placeholder="Enter primary funding source..."
                      value={ primary_funding }
                      onChange={ this.onChange.bind(this) }/>
                  <FormRow id="secondary_funding"
                      placeholder="Enter secondary funding source..."
                      value={ secondary_funding }
                      onChange={ this.onChange.bind(this) }/>
                  { type === "measure" ? null :
                    <FormRow id="num_staff"
                        type="number"
                        value={ num_staff }
                        onChange={ this.onChange.bind(this) }/>
                  }
                  { type === "measure" ? null :
                    <FormRow id="num_contract_staff"
                        type="number"
                        value={ num_contract_staff }
                        onChange={ this.onChange.bind(this) }/>
                  }
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
                        hazardList.slice(0, 9).map(hazard =>
                          ({ id: hazard, checked: hazards && hazards.includes(hazard) })
                        ),
                        hazardList.slice(9).map(hazard =>
                          ({ id: hazard, checked: hazards && hazards.includes(hazard) })
                        )
                      ]
                    }/>

                    <div className="accordion-instructions">
                      { getInstructions("hazards") }
                    </div>
                </Accordion>


                { type !== "program" ? null :
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
                    <div className="accordion-instructions">
                      { getInstructions("admin") }
                    </div>
                  </Accordion>
                }

                <Accordion title="Capabilities">
                  <CheckGroup onChange={ this.checkbox.bind(this) }
                    checks={
                      [[
                        { id: "capability_administer_funding", checked: capability_administer_funding },
                        { id: "capability_climate", checked: capability_climate },
                        { id: "capability_construction", checked: capability_construction }, 
                        { id: "capability_critical", checked: capability_critical },
                        { id: "capability_outreach", checked: capability_outreach },
                        { id: "capability_environmental", checked: capability_environmental },
                        { id: "capability_preservation", checked: capability_preservation },
                        { id: "capability_mitigation", checked: capability_mitigation },
                        { id: "capability_preparedness", checked: capability_preparedness },
                                                
                      ],
                      [
                        { id: "capability_policy", checked: capability_policy },
                        { id: "capability_project_management", checked: capability_project_management },
                        { id: "capability_recovery", checked: capability_recovery },
                        { id: "capability_regulatory", checked: capability_regulatory },
                        { id: "capability_research", checked: capability_research },
                        { id: "capability_resiliency", checked: capability_resiliency },
                        { id: "capability_response", checked: capability_response },
                        { id: "capability_risk_assessment", checked: capability_risk_assessment },
                        { id: "capability_tech_support", checked: capability_tech_support },
                      
                      ]]
                    }/>
                    <div className="accordion-instructions">
                      { getInstructions("capability_tech_support") }
                    </div>
                </Accordion>

                { type !== 'action' ? null :
                  <Accordion title={ getLabel("priority_1") }
                    instructions={ getInstructions("priority_1") }>
                    <PriorityRow onChange={ this.setPriority.bind(this) }
                      id="priority_1" value={ priority_1 }/>
                  </Accordion>
                }
                { type !== 'action' ? null :
                  <Accordion title={ getLabel("priority_2") }
                    instructions={ getInstructions("priority_2") }>
                    <PriorityRow onChange={ this.setPriority.bind(this) }
                      id="priority_2" value={ priority_2 }/>
                  </Accordion>
                }
                { type !== 'action' ? null :
                  <Accordion title={ getLabel("priority_3") }
                    instructions={ getInstructions("priority_3") }>
                    <PriorityRow onChange={ this.setPriority.bind(this) }
                      id="priority_3" value={ priority_3 }/>
                  </Accordion>
                }
                { type !== 'action' ? null :
                  <Accordion title={ getLabel("priority_4") }
                    instructions={ getInstructions("priority_4") }>
                    <PriorityRow onChange={ this.setPriority.bind(this) }
                      id="priority_4" value={ priority_4 }/>
                  </Accordion>
                }
                { type !== 'action' ? null :
                  <Accordion title={ getLabel("priority_5") }
                    instructions={ getInstructions("priority_5") }>
                    <PriorityRow onChange={ this.setPriority.bind(this) }
                      id="priority_5" value={ priority_5 }/>
                  </Accordion>
                }
                { type !== 'action' ? null :
                  <Accordion title={ getLabel("priority_6") }
                    instructions={ getInstructions("priority_6") }>
                    <PriorityRow onChange={ this.setPriority.bind(this) }
                      id="priority_6" value={ priority_6 }/>
                  </Accordion>
                }
                { type !== 'action' ? null :
                  <Accordion title={ getLabel("priority_7") }
                    instructions={ getInstructions("priority_7") }>
                    <PriorityRow onChange={ this.setPriority.bind(this) }
                      id="priority_7" value={ priority_7 }/>
                  </Accordion>
                }

                <GoalAccordion goal={ goal }
                  onChange={ this.updateGoal.bind(this) }/>

                { type === "measure" ? null :
                  <Accordion title={ getLabel("file_type") }
                    instructions={ getInstructions("file_type") }>
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
                }

                <CheckGroup onChange={ this.checkbox.bind(this) }
                  instructions={ getInstructions("repetitive_loss") }
                  header={ "" }
                  checks={
                    [[
                      { id: "repetitive_loss", checked: repetitive_loss }
                    ]]
                  }/>


              


                { type !== "action" ? null :
                  <Accordion title="Action Requirements">
                    <CheckGroup onChange={ this.checkbox.bind(this) }
                      instructions={ getInstructions("benefit_cost_analysis") }
                      header={ "" }
                      checks={
                        [[
                          { id: "benefit_cost_analysis", checked: benefit_cost_analysis }
                        ]]
                      }/>

                    <CheckGroup onChange={ this.checkbox.bind(this) }
                      instructions={ getInstructions("engineering_required") }
                      header={ "" }
                      checks={
                        [[
                          { id: "engineering_required", checked: engineering_required }
                        ]]
                      }/>

                    { !engineering_required ? null :
                      <CheckGroup onChange={ this.checkbox.bind(this) }
                        instructions={ getInstructions("engineering_complete") }
                        header={ "" }
                        checks={
                          [[
                            { id: "engineering_complete", checked: engineering_complete }
                          ]]
                        }/>
                    }
                  </Accordion>
                }

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
    path: '/capabilities/manage/new',
    name: 'Capabilities',
    mainNav: false,
    auth: false,
    subMenus: [],
    exact: true,
    breadcrumbs: [
      { name: 'Capabilities', path: '/capabilities/manage' },
      { name: 'New Capability', path: '/capabilities/manage/new' }
    ],
    menuSettings: { image: 'none', scheme: 'color-scheme-light' },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(NewCapability))
  },
  {
    path: '/capabilities/manage/edit/:id',
    name: 'Capabilities',
    mainNav: false,
    auth: false,
    subMenus: [],
    exact: true,
    breadcrumbs: [
      { name: 'Capabilities', path: '/capabilities/manage' },
      { param: 'id', path: '/capabilities/manage/edit/edit/' }
    ],
    menuSettings: { image: 'none', scheme: 'color-scheme-light' },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(NewCapability))
  }
]