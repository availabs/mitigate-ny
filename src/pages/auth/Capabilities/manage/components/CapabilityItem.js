import React from 'react';
import { connect } from 'react-redux';

import { push } from 'react-router-redux';
import { Link } from "react-router-dom"

import ElementBox from 'components/light-admin/containers/ElementBox'

import {
  sendSystemMessage
} from 'store/modules/messages';

import {
	setCapabilityData,
	getLabel
} from 'store/modules/capabilities'

import {
  getHazardName
} from 'utils/sheldusUtils';

class CapabilityItem extends React.Component {

	state = {
		opened: false
	}
	toggleOpened() {
		const opened = !this.state.opened;
		this.setState({ opened });
	}

  	getHazardName(hazard) {
    	try {
      		return this.props.riskIndex.meta[hazard].name;
    	}
    	catch (e) {
      		return getHazardName(hazard);
    	}
  	}

	reduceStatus() {
		const { 
			status_new_shmp,
	        status_carryover_shmp,
	        status_in_progess,
	        status_on_going,
	        status_unchanged,
	        status_completed,
	        status_discontinued
	    } = this.props;
		const reduce = [];
		if (status_new_shmp) reduce.push("status_new_shmp");
		if (status_carryover_shmp) reduce.push("status_carryover_shmp");
		if (status_in_progess) reduce.push("status_in_progess");
		if (status_on_going) reduce.push("status_on_going");
		if (status_unchanged) reduce.push("status_unchanged");
		if (status_completed) reduce.push("status_completed");
		if (status_discontinued) reduce.push("status_discontinued");
		return reduce;
	}
	reduceAdmin() {
		const {
	        admin_statewide,
	        admin_regional,
	        admin_county,
	        admin_local
		} = this.props;
		const reduce = [];
		if (admin_statewide) reduce.push("admin_statewide");
		if (admin_regional) reduce.push("admin_regional");
		if (admin_county) reduce.push("admin_county");
		if (admin_local) reduce.push("admin_local");
		return reduce;
	}
	reduceCapability() {
		const {
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
	        capability_regulatory
		} = this.props;
		const reduce = [];
		if (capability_mitigation) reduce.push("capability_mitigation");
		if (capability_preparedness) reduce.push("capability_preparedness");
		if (capability_response) reduce.push("capability_response");
		if (capability_recovery) reduce.push("capability_recovery");
		if (capability_climate) reduce.push("capability_climate");
		if (capability_critical) reduce.push("capability_critical");
		if (capability_preservation) reduce.push("capability_preservation");
		if (capability_environmental) reduce.push("capability_environmental");
		if (capability_risk_assessment) reduce.push("capability_risk_assessment");
		if (capability_administer_funding) reduce.push("capability_administer_funding");
		if (capability_funding_amount) reduce.push("capability_funding_amount");
		if (capability_tech_support) reduce.push("capability_tech_support");
		if (capability_construction) reduce.push("capability_construction");
		if (capability_outreach) reduce.push("capability_outreach");
		if (capability_project_management) reduce.push("capability_project_management");
		if (capability_research) reduce.push("capability_research");
		if (capability_policy) reduce.push("capability_policy");
		if (capability_regulatory) reduce.push("capability_regulatory");
		return reduce;
	}

	deleteCapability() {
		this.props.sendSystemMessage(
			`Are you sure you with to delete capability "${ this.props.name }"?`,
			{
				onConfirm: () => this.props.deleteCapability(this.props.id),
				id: `delete-content-${ this.props.id }`,
				type: "danger",
				duration: 0
			}
		)
	}

	makeHazardList() {
		const { hazards } = this.props,
			split = hazards.split("|").map(h => h.trim()),
			slice = Math.ceil(split.length / 3),
			mappedHazards = split.map(hazard => ({ hazard, name: this.getHazardName(hazard) }))
				.sort((a, b) => a.name < b.name ? -1 : 1);
		return (
			<div className="col-sm-12">
				<div className="row">
					<div className="col-sm-12">
						<span style={ { fontWeight: "bold", fontSize: "1.1rem" } }>Hazards</span>:
					</div>
					{ !mappedHazards.slice(0, slice).length ? null :
						<div className="col-sm-4">
							<table className="table">
								<tbody>
									{ mappedHazards.slice(0, slice).map(h => <tr key={ h.hazard }><td>{ h.name }</td></tr>) }
								</tbody>
							</table>
						</div>
					}
					{ !mappedHazards.slice(slice, slice * 2).length ? null :
						<div className="col-sm-4">
							<table className="table">
								<tbody>
									{ mappedHazards.slice(slice, slice * 2).map(h => <tr key={ h.hazard }><td>{ h.name }</td></tr>) }
								</tbody>
							</table>
						</div>
					}
					{ !mappedHazards.slice(slice * 2).length ? null :
						<div className="col-sm-4">
							<table className="table">
								<tbody>
									{ mappedHazards.slice(slice * 2).map(h => <tr key={ h.hazard }><td>{ h.name }</td></tr>) }
								</tbody>
							</table>
						</div>
					}
				</div>
			</div>
		)
	}

	render() {
		const { opened } = this.state,
			{
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
		        objective,
				updated_at
			} = this.props,
			status = this.reduceStatus(),
			admin = this.reduceAdmin(),
			capability = this.reduceCapability();
		return (
			<div className="row">
				<div className="col-lg-12">
					<ElementBox>
						<div className="row">
							<div className="col-lg-5">
								<button className="btn btn-lg btn-light" onClick={ this.toggleOpened.bind(this) }
									style={ { maxWidth: "100%", overflow: "hidden" } }>
									<span style={ { padding: "0px 10px 0px 0px" } } className={ 'os-icon ' + (opened ? "os-icon-arrow-up4" : "os-icon-arrow-down3") }/>
									{ name }
								</button>
							</div>
							<div className="col-lg-3" style={ { paddingTop: "10px" } }>
								<h5 style={ { display: "inline-block", paddingRight: "10px" } }>Updated At:</h5>
								{ new Date(updated_at).toLocaleString() }
							</div>
							<div className="col-lg-4">
								<div className="float-right">
									<Link className="btn btn-lg btn-outline-primary"
										to={ `/capabilities/manage/edit/${ id }` }>
										Edit
									</Link>
									<button className="btn btn-lg btn-outline-danger"
										onClick={ this.deleteCapability.bind(this) }>
										Delete
									</button>
								</div>
							</div>
						</div>
						{ !opened ? null :
							<div className="row" style={ { marginTop: "10px" } }>
								<div className="col-sm-12" style={ { borderBottom: "solid 2px rgba(83, 101, 140, 0.33)", marginBottom: "5px" } }>
									<span className="capability-name">{ name }</span>
								</div>
								<div className="col-sm-8" style={ { borderBottom: "solid 2px rgba(83, 101, 140, 0.33)", marginBottom: "5px" } }>
									<span className="contact-name">{ contact }</span>
								</div>
								<div className="col-sm-4" style={ { borderBottom: "solid 2px rgba(83, 101, 140, 0.33)", marginBottom: "5px", paddingTop: "5px" } }>
									<span className="label-header">Agency</span>: { agency }
								</div>
								<div className="col-sm-4">
									<span className="label-header">Email</span>: { contact_email }
								</div>
								<div className="col-sm-4">
									<span className="label-header">Title</span>: { contact_title }
								</div>
								<div className="col-sm-4">
									<span className="label-header">Dept</span>: { contact_department }
								</div>
								
								{ !partners ? null :
									<div className="col-sm-4">
										<span className="label-header">Partners</span>: { partners }
									</div>
								}
								
								{ !budget_provided ? null :
									<div className="col-sm-4">
										<span className="label-header">Budget Provided</span>: { budget_provided }
									</div>
								}

								<div className="col-sm-12 capability-section">
									<span className="label-header">Description</span>: { description }
								</div>

								{ !(hazards && hazards.length) ? null :
									this.makeHazardList()
								}

								<div className="col-sm-12 capability-section">
									<div className="row">

										{ !status.length ? <div className="col-sm-4"/> :
											<div className="col-sm-4">
												<span className="label-header">Status</span>
											</div>
										}
										{ !admin.length ? <div className="col-sm-4"/> :
											<div className="col-sm-4">
												<span className="label-header">Administration</span>
											</div>
										}
										{ !capability.length ? <div className="col-sm-4"/> :
											<div className="col-sm-4">
												<span className="label-header">Capabilities</span>
											</div>
										}

										{ !status.length ? null :
											<div className="col-sm-4">
												<table className="table">
													<tbody>
														{
															status.map(s => <tr key={ s }><td>{ getLabel(s) }</td></tr>)
														}
													</tbody>
												</table>
											</div>
										}
										{ !admin.length ? null :
											<div className="col-sm-4">
												<table className="table">
													<tbody>
														{
															admin.map(a => <tr key={ a }><td>{ getLabel(a) }</td></tr>)
														}
													</tbody>
												</table>
											</div>
										}
										{ !capability.length ? null :
											<div className="col-sm-4">
												<table className="table">
													<tbody>
														{
															capability.map(c => <tr key={ c }><td>{ getLabel(c) }</td></tr>)
														}
													</tbody>
												</table>
											</div>
										}

									</div>
								</div>

								{ !url ? null :
									<div className="col-sm-12">
										<a href={ url } target="_blank">Project URL</a>
									</div>
								}

							</div>
						}
					</ElementBox>
				</div>
			</div>
		)
	}
}


const mapStateToProps = state => ({
    user: state.user,
    router: state.router,
    riskIndex: state.graph.riskIndex
})

const mapDispatchToProps = {
	sendSystemMessage,
	setCapabilityData,
	push: url => dispatch => dispatch(push(url))
};

export default connect(mapStateToProps, mapDispatchToProps)(CapabilityItem);