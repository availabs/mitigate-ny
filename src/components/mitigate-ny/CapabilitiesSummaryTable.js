import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

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

const CAPABILITIES = [
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
	"capability_resiliency"
]

class CCTable extends React.Component {
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
	createRow(row, filtered, { agencies, capabilities }) {
		const _agencies = {},
			_capabilities = {};
		filtered.forEach(cap => {
			if (cap.agency)	{
				cap.agency.split("|").map(a => a.trim()).forEach(a => {
					_agencies[a] = true;
				})
			}
			CAPABILITIES.forEach(C => {
				_capabilities[C] = _capabilities[C] || cap[C];
			})
		})
		const caps = Object.keys(_capabilities).filter(c => _capabilities[c]).length
		return {
			...row,
			"programs": filtered.length,
			"agencies": `${ Object.keys(_agencies).length } / ${ agencies }`,
			"capabilities": `${ caps } / ${ capabilities }`
		}

	}
	splitByHazards() {
		const sortBy = this.props.sortBy,
			caps = this.props.capabilities.filter(c => c.hazards),
			data = [],
			hazards = {},
			_agencies = {},
			_capabilities = {};
		caps.forEach(cap => {
			cap.hazards.split("|").map(h => h.trim()).forEach(hazard => {
				hazards[hazard] = true;
			})
			if (cap.agency) {
				_agencies[cap.agency] = true
			}
			CAPABILITIES.forEach(C => {
				_capabilities[C] = _capabilities[C] || cap[C];
			})
		})
		const agencies = Object.keys(_agencies).length,
			capabilities = Object.keys(_capabilities).filter(c => _capabilities[c]).length;
		Object.keys(hazards).forEach(hazard => {
			const filtered = caps.filter(c => c.hazards.includes(hazard));
			hazard = this.getHazardName(hazard);
			data.push(this.createRow({ hazard }, filtered, { agencies, capabilities }));
		})
		return data.sort((a, b) => b[sortBy] - a[sortBy]);
	}
	processData() {
		let data = [],
			columns = [];
		switch (this.props.groupBy) {
			case "hazards":
				data = this.splitByHazards();
				columns = ["hazard", ...this.props.columns]
		}
		return { data, columns };
	}
	render() {
		return (
			<TableBox { ...this.processData() }/>
		)
	}
}

CCTable.defaultProps = {
	groupBy: "hazards",
	columns: ["programs", "agencies", "capabilities"],
	sortBy: "programs"
}

const mapStateToProps = state => ({
    router: state.router,
    capabilities: state.capabilities.capabilities,
    riskIndexGraph: state.graph.riskIndex
})

const mapDispatchToProps = {
  	receiveCapabilities,
  	receiveHazards
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CCTable))