import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import get from "lodash.get";

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBox'

import {
  	ATTRIBUTES,
  	receiveCapabilities,
  	receiveHazards,
  	getLabel
} from "store/modules/capabilities"

import {
  getHazardName
} from 'utils/sheldusUtils'

/*
	capability_mitigation
	capability_preparedness
	capability_response
	capability_recovery
	capability_climate
	capability_critical
	capability_preservation
	capability_environmental
	capability_risk_assessment
	capability_administer_funding
	capability_funding_amount
	capability_tech_support
	capability_construction
	capability_outreach
	capability_project_management
	capability_research
	capability_policy
	capability_regulatory
	capability_resiliency
*/

/*
	status_new_shmp
	status_carryover_shmp
	status_in_progess
	status_on_going
	status_unchanged
	status_completed
	status_discontinued
*/

class CapabilitiesTable extends React.Component {

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
  	.then(length =>
  		this.props.falcor.get(
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
      		this.props.receiveCapabilities(capabilities);
    		})
  	)
	}

	getHazardName(hazard) {
  	try {
    		return this.props.riskIndexGraph.meta[hazard].name;
  	}
  	catch (e) {
    		return getHazardName(hazard);
  	}
	}

	processData() {
		const budgetRegex = /[$]?(\d+)([kKmMbBtT]?)/,
			columns = this.props.columns,
			data = this.props.capabilities
				.filter(capability => {
					let filtered = !this.props.goalRange;
					if (!filtered) {
						const range = this.props.goalRange.split(",").map(gr => +gr.trim()),
							goal = capability.goal || "0",
							split = goal.split("|").map(g => +g.trim()).sort();
						range.push(range[range.length - 1] + 1);
						filtered = split.reduce((a, c) => a || (c >= range[0] && c < range[range.length -1]), false);
					}
					return filtered;
				})
				.filter(capability => !this.props.capability || this.props.capability.split(",").reduce((a, c) => a || capability[c.trim()], false))
				.filter(capability => !this.props.status || this.props.status.split(",").reduce((a, c) => a || capability[c.trim()], false))
				.filter(({ type }) => !this.props.type || (type && (type === this.props.type)))
				.filter(({ agency }) => !this.props.agency || (agency && (agency === this.props.agency)))
				.filter(({ hazards }) => !this.props.hazard || (hazards && (hazards.includes(this.props.hazard))))
				.map(capability => {
					const row = {};
					columns.forEach(att => {
						switch (att) {
							case "status":
								row[getLabel("status")] = [
									"status_new_shmp",
									"status_carryover_shmp",
									"status_in_progess",
									"status_on_going",
									"status_unchanged",
									"status_completed",
									"status_discontinued"
								].reduce((a, c) => capability[c] ? a.concat(getLabel(c)) : a, []).join(" | ");
								break;
							case "capability":
								row[getLabel("capability")] = [
									"capability_mitigation",
									"capability_preparedness",
									"capability_response",
									"capability_recovery",
									"capability_climate",
									"capability_critical",
									"capability_preservation",
									"capability_environmental",
									"capability_risk_assessment",
									"capability_administer_funding",
									"capability_tech_support",
									"capability_construction",
									"capability_outreach",
									"capability_project_management",
									"capability_research",
									"capability_policy",
									"capability_regulatory",
									"capability_resiliency",
								].reduce((a, c) => capability[c] ? a.concat(getLabel(c)) : a, []).join(" | ");
								break;	
							case "admin":
								row[getLabel("admin")] = [
									"admin_statewide",
									"admin_regional",
									"admin_county",
									"admin_local"
								].reduce((a, c) => capability[c] ? a.concat(getLabel(c)) : a, []).join(" | ");
								break;
							case "hazards":
								if (!capability.hazards) break;
								row[getLabel("hazards")] = capability.hazards.split("|").map(h => this.getHazardName(h.trim())).join(" | ")
								break;
							default:
								const value = capability[att];
								if (typeof value === "boolean") {
									row[getLabel(att)] = value.toString();
								}
								else {
									row[getLabel(att)] =  value;
								}
								break;
						}
					});
					return row;
				});
		return {
			data,
			columns: columns.map(c => getLabel(c))
		};
	}

	render() {
		return (
			<TableBox { ...this.processData() }
				title={ this.props.title }
				filterKey="Name"
				pageSize={ this.props.pageSize }
				filterColumns={ this.props.filterColumns.map(fc => getLabel(fc)) }
				expandColumns={ this.props.expandColumns.map(ec => getLabel(ec)) }
				urlColumn={ this.props.urlColumn && getLabel(this.props.urlColumn) }			
				tableLink={ this.props.tableLink }
				tableLinkLabel={ this.props.tableLinkLabel }
				downloadedFileName={ this.props.downloadedFileName }
				tableScroll={ this.props.tableScroll }/>
		)
	}
}

CapabilitiesTable.defaultProps = {
	agency: null,
	hazard: null,
	capability: null,
	status: null,
	title: "Capabilities",
	columns: ["name", "agency", "description", "budget_provided", "goal", "primary_funding", "status", "admin"],
	type: null,
	filterColumns: [],
	expandColumns: [],
	urlColumn: null,
	goalRange: null,
	tableLink: null,
	tableLinkLabel: "Link",
	downloadedFileName: 'capabilities-data',
	tableScroll: false,
	pageSize: 6
}

const mapStateToProps = state => ({
    router: state.router,
    hazards: state.capabilities.hazards,
    capabilities: state.capabilities.capabilities,
    riskIndexGraph: state.graph.riskIndex
})

const mapDispatchToProps = {
  	receiveCapabilities,
  	receiveHazards
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CapabilitiesTable))