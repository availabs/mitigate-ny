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

	processData() {
		const budgetRegex = /[$]?(\d+)([kKmMbBtT]?)/,
			attributes = ["name", "agency", "description", "budget_provided"],
			data = this.props.capabilities
				.filter(capability => !this.props.capability || capability[this.props.capability])
				.filter(({ agency }) => !this.props.agency || (agency && (agency === this.props.agency)))
				.filter(({ hazards }) => !this.props.hazard || (hazards && (hazards.includes(this.props.hazard))))
				.map(capability => {
					const row = {};
					attributes.forEach(att => row[getLabel(att)] = capability[att]);
					row.budget = 0;
					if (capability.budget_provided) {
						const m = budgetRegex.exec(capability.budget_provided);
						if (m) {
							const amount = m[1],
								mult = m[2];
							if (amount && mult) {
								switch (mult.toLowerCase()) {
									case "k":
										row.budget = +amount * 1000;
										break;
									case "m":
										row.budget = +amount * 1000000;
										break;
									case "b":
										row.budget = +amount * 1000000000;
										break;
									case "t":
										row.budget = +amount * 1000000000000;
										break;
								}
							}
							else if (amount) {
								row.budget = +amount;
							}
						}
					}
					return row;
				})
				.sort((a, b) => b.budget - a.budget);
		return { data, columns: attributes.map(att => getLabel(att)) };
	}

	render() {
		return (
			<TableBox { ...this.processData() }
				title="Capabilities"
				pageSize={ 6 }/>
		)
	}
}

CapabilitiesTable.defaultProps = {
	agency: null,
	hazard: null,
	capability: null
}

const mapStateToProps = state => ({
    router: state.router,
    hazards: state.capabilities.hazards,
    capabilities: state.capabilities.capabilities
})

const mapDispatchToProps = {
  	receiveCapabilities,
  	receiveHazards
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CapabilitiesTable))