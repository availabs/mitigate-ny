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
	createRow(row, filtered, { hazards=0, agencies=0, capabilities=0, goals=0 }) {
		const _agencies = {},
			_capabilities = {},
			_goals = {},
			_hazards = {};
		let regional = 0,
			statewide = 0,
			local = 0,
			funding = 0,
			budget = 0,
			staff = 0,
			contractStaff = 0;
		filtered.forEach(cap => {
			if (cap.agency)	{
				cap.agency.split("|").map(a => a.trim()).forEach(a => {
					_agencies[a] = true;
				})
			}
			CAPABILITIES.forEach(C => {
				_capabilities[C] = _capabilities[C] || cap[C];
			})
			if (cap.goal) {
				cap.goal.split("|").map(a => a.trim()).forEach(g => {
					_goals[g] = true;
				})
			}
			if (cap.hazards) {
				cap.hazards.split("|").map(a => a.trim()).forEach(g => {
					_hazards[g] = true;
				})
			}
			regional += cap.admin_regional ? 1 : 0;
			statewide += cap.admin_statewide ? 1 : 0;
			local += cap.admin_local ? 1 : 0;
			if (parseFloat(cap.capability_funding_amount)) {
				funding += parseFloat(cap.capability_funding_amount)
			}
			if (parseFloat(cap.budget_provided)) {
				budget += parseFloat(cap.budget_provided)
			}
			if (parseFloat(cap.num_staff)) {
				staff += parseFloat(cap.num_staff);
			}
			if (parseFloat(cap.num_contract_staff)) {
				contractStaff += parseFloat(cap.num_contract_staff);
			}
		})
		const caps = Object.keys(_capabilities).filter(c => _capabilities[c]).length
		return {
			...row,
			"programs": filtered.filter(c => c.type === 'program').length,
			"measures": filtered.filter(c => c.type === 'measure').length,
			"actions": filtered.filter(c => c.type === 'action').length,
			"agencies": `${ Object.keys(_agencies).length } / ${ agencies }`,
			"capabilities": `${ caps } / ${ capabilities }`,
			"goals": `${ Object.keys(_goals).length } / ${ goals }`,
			regional,
			statewide,
			local,
			funding,
			budget,
			staff,
			"contract staff": contractStaff,
			"hazards": `${ Object.keys(_hazards).length } / ${ hazards }`
		}

	}
	splitByHazards() {
		const filterBy = this.props.filterBy,
			caps = this.props.capabilities
												.filter(c => !filterBy || c.type === filterBy)
												.filter(c => c.hazards),
			data = [],
			hazards = {},
			_agencies = {},
			_capabilities = {},
			_goals = {};
		caps.forEach(cap => {
			cap.hazards.split("|").map(h => h.trim()).forEach(hazard => {
				hazards[hazard] = true;
			})
			if (cap.agency) {
				cap.agency.split("|").map(a => a.trim()).forEach(a => {
					_agencies[a] = true;
				})
			}
			CAPABILITIES.forEach(C => {
				_capabilities[C] = _capabilities[C] || cap[C];
			})
			if (cap.goal) {
				cap.goal.split("|").map(a => a.trim()).forEach(g => {
					_goals[g] = true;
				})
			}
		})
		const agencies = Object.keys(_agencies).length,
			capabilities = Object.keys(_capabilities).filter(c => _capabilities[c]).length,
			goals = Object.keys(_goals).length;
		Object.keys(hazards).forEach(hazard => {
			const filtered = caps.filter(c => c.hazards.includes(hazard));
			hazard = this.getHazardName(hazard);
			data.push(this.createRow({ hazard }, filtered, { agencies, capabilities, goals }));
		})
		return data;
	}
	splitByAgencies() {
		const filterBy = this.props.filterBy,
			caps = this.props.capabilities
												.filter(c => !filterBy || c.type === filterBy)
												.filter(c => c.agency),
			data = [],
			agencies = {},
			_hazards = {},
			_capabilities = {},
			_goals = {};
		caps.forEach(cap => {
			cap.agency.split("|").map(h => h.trim()).forEach(agency => {
				agencies[agency] = true;
			})
			if (cap.hazards) {
				cap.hazards.split("|").map(a => a.trim()).forEach(h => {
					_hazards[h] = true;
				})
			}
			CAPABILITIES.forEach(C => {
				_capabilities[C] = _capabilities[C] || cap[C];
			})
			if (cap.goal) {
				cap.goal.split("|").map(a => a.trim()).forEach(g => {
					_goals[g] = true;
				})
			}
		})
		const hazards = Object.keys(_hazards).length,
			capabilities = Object.keys(_capabilities).filter(c => _capabilities[c]).length,
			goals = Object.keys(_goals).length;
		Object.keys(agencies).forEach(agency => {
			const filtered = caps.filter(c => c.agency.includes(agency));
			data.push(this.createRow({ agency }, filtered, { hazards, capabilities, goals }));
		})
		return data;
	}
	splitByCapabilities() {
		const filterBy = this.props.filterBy,
			caps = this.props.capabilities.filter(c => !filterBy || c.type === filterBy),
			data = [],
			capabilities = {},
			_hazards = {},
			_agencies = {},
			_goals = {};
		caps.forEach(cap => {
			CAPABILITIES.forEach(C => {
				capabilities[C] = capabilities[C] || cap[C];
			})
			if (cap.hazards) {
				cap.hazards.split("|").map(a => a.trim()).forEach(h => {
					_hazards[h] = true;
				})
			}
			if (cap.goal) {
				cap.goal.split("|").map(a => a.trim()).forEach(g => {
					_goals[g] = true;
				})
			}
			if (cap.agency) {
				cap.agency.split("|").map(a => a.trim()).forEach(a => {
					_agencies[a] = true;
				})
			}
		})
		const hazards = Object.keys(_hazards).length,
			agencies = Object.keys(_agencies).filter(c => _agencies[c]).length,
			goals = Object.keys(_goals).length;
		Object.keys(capabilities).filter(c => capabilities[c]).forEach(capability => {
			const filtered = caps.filter(c => c[capability]);
			data.push(this.createRow({ capability }, filtered, { hazards, agencies, goals }));
		})
		return data;
	}
	splitByGoals() {
		const filterBy = this.props.filterBy,
			caps = this.props.capabilities
												.filter(c => !filterBy || c.type === filterBy)
												.filter(c => c.goal),
			data = [],
			goals = {},
			_hazards = {},
			_capabilities = {},
			_agencies = {};
		caps.forEach(cap => {
			cap.goal.split("|").map(h => h.trim()).forEach(goal => {
				goals[goal] = true;
			})
			if (cap.hazards) {
				cap.hazards.split("|").map(a => a.trim()).forEach(h => {
					_hazards[h] = true;
				})
			}
			CAPABILITIES.forEach(C => {
				_capabilities[C] = _capabilities[C] || cap[C];
			})
			if (cap.agency) {
				cap.agency.split("|").map(a => a.trim()).forEach(a => {
					_agencies[a] = true;
				})
			}
		})
		const hazards = Object.keys(_hazards).length,
			capabilities = Object.keys(_capabilities).filter(c => _capabilities[c]).length,
			agencies = Object.keys(_agencies).length;
		Object.keys(goals).filter(g => g).forEach(goal => {
			const filtered = caps.filter(c => c.goal.includes(goal));
			data.push(this.createRow({ goal }, filtered, { hazards, capabilities, agencies }));
		})
		return data;
	}
	processData() {
		let data = [],
			columns = [];
		switch (this.props.groupBy) {
			case "hazard":
				data = this.splitByHazards();
				columns = ["hazard", ...this.props.columns]
				break;
			case "agency":
				data = this.splitByAgencies();
				columns = ["agency", ...this.props.columns]
				break;
			case "capability":
				data = this.splitByCapabilities();
				columns = ["capability", ...this.props.columns]
				break;
			case "goal":
				data = this.splitByGoals();
				columns = ["goal", ...this.props.columns]
				break;
		}
		return { data, columns };
	}
	render() {
		return (
			<TableBox { ...this.processData() }
				title={ this.props.title }
				pageSize={ this.props.pageSize }/>
		)
	}
}

CCTable.defaultProps = {
	title: "title" ,
	groupBy: "hazard", // agency, capability, goal
	columns: ["programs",
						"measures",
						"actions",
						"agencies",
						"capabilities",
						"goals",
						"funding",
						"budget",
						"staff",
						"contract staff",
						"regional",
						"statewide",
						"local"],
	filterBy: null, // measure, action, program
	pageSize: 9
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