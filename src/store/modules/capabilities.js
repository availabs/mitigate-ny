const RECEIVE_CAPABILITIES = "RECEIVE_CAPABILITIES",
	UPDATE_CAPABILITY = "UPDATE_CAPABILITY",

	RECEIVE_HAZARDS = "RECEIVE_HAZARDS",

	RECEIVE_AGENCIES = "RECEIVE_AGENCIES",

	TOGGLE_HAZARD_FILTER = "TOGGLE_HAZARD_FILTER",
	TOGGLE_AGENCY_FILTER = "TOGGLE_AGENCY_FILTER",
	TOGGLE_TYPE_FILTER = "TOGGLE_TYPE_FILTER",

	SET_CAPABILITY_DATA = "SET_CAPABILITY_DATA",
	CLEAR_CAPABILITY_DATA = "CLEAR_CAPABILITY_DATA";

export const ATTRIBUTES = [
	"name",
	"description",
	"contact",
	"contact_email",
	"contact_title",
	"contact_department",
	"agency",
	"partners",
	"status_new_shmp",
	"status_carryover_shmp",
	"status_in_progess",
	"status_on_going",
	"status_unchanged",
	"status_completed",
	"status_discontinued",
	"admin_statewide",
	"admin_regional",
	"admin_county",
	"admin_local",
	"file_type_shp",
	"file_type_lat_lon",
	"file_type_address",
	"file_type_not_tracked",
	"budget_provided",
	"primary_funding",
	"secondary_funding",
	"num_staff",
	"num_contract_staff",
	"hazards",
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

	"funding_amount",

	"capability_tech_support",
	"capability_construction",
	"capability_outreach",
	"capability_project_management",
	"capability_research",
	"capability_policy",
	"capability_regulatory",
	"related_policy",
	"url",
	"goal",
	"objective",

	"priority",
	"priority_1",
	"priority_2",
	"priority_3",
	"priority_4",
	"priority_5",
	"priority_6",
	"priority_7",
	"priority_total",

	"benefit_cost_analysis",

	"engineering_required",
	"engineering_complete",

	"type",

	"municipality",
	"county",

	"capability_resiliency",

	"repetitive_loss",

	"origin_plan_name",
	"origin_plan_year",

	"funding_received",

	"design_percent_complete",
	"scope_percent_complete",

	"status_proposed",

	"start_date",
	"completed_date",

	"justification",
	
	"id",
	"created_at",
	"updated_at"
]
export const NEW_CAPABILITY_ATTRIBUTES = ATTRIBUTES.slice(0, ATTRIBUTES.length - 3);
export const META_DATA = {
	"name": { defaultValue: "", label: "Program/Action/Measure Name" },
	"description": { defaultValue: "", label: "Description" },
	"contact": { defaultValue: "", label: "Contact" },
	"contact_email": { defaultValue: "", label: "Contact Email" },
	"contact_title": { defaultValue: "", label: "Contact Title" },
	"contact_department": { defaultValue: "", label: "Contact Department" },
	"agency": { defaultValue: "", label: "Agency (acronym)" },
	"partners": { defaultValue: "", label: "Partners" },

	"status_new_shmp": { defaultValue: false, label: "New 2019 SHMP" },
	"status_carryover_shmp": { defaultValue: false, label: "Carryover SHMP" },

	"status_in_progess": { defaultValue: false, label: "In Progress" },
	"status_on_going": { defaultValue: false, label: "On Going" },
	"status_unchanged": { defaultValue: false, label: "Unchanged" },
	"status_completed": { defaultValue: false, label: "Completed" },
	"status_discontinued": { defaultValue: false, label: "Discontinued" },

	"admin_statewide": { defaultValue: false, label: "Statewide" },
	"admin_regional": { defaultValue: false, label: "Regional" },
	"admin_county": { defaultValue: false, label: "County" },
	"admin_local": { defaultValue: false, label: "Local" },

	"file_type_shp": { defaultValue: false, label: "Shape File" },
	"file_type_lat_lon": { defaultValue: false, label: "Lat / Lon .csv" },
	"file_type_address": { defaultValue: false, label: "Address" },
	"file_type_not_tracked": { defaultValue: false, label: "File Type Not Tracked" },
	"file_type": { instruction: "Please let us know if there is a location file associated with this project/program",
								label: "File Type" },

	"budget_provided": { defaultValue: null, label: "Budget Provided", instruction: "Annual Budget Provided for Program or Estimate/Actual Cost of Mitigation Action"  },
	"primary_funding": { defaultValue: "", label: "Primary Funding", instruction: "State/Federal"  },
	"secondary_funding": { defaultValue: "", label: "Secondary Funding", instruction: "Source" },
	"num_staff": { defaultValue: null, label: "Num. Staff" },
	"num_contract_staff": { defaultValue: null, label: "Num. Contract Staff" },
	"hazards": { defaultValue: "", label: "Hazards", instruction: "Select all that apply" },

	"capability_mitigation": { defaultValue: false, label: "Mitigation" },
	"capability_preparedness": { defaultValue: false, label: "Preparedness" },
	"capability_response": { defaultValue: false, label: "Response" },
	"capability_recovery": { defaultValue: false, label: "Recovery" },
	"capability_climate": { defaultValue: false, label: "Climate Related" },
	"capability_critical": { defaultValue: false, label: "Critical Facilities" },
	"capability_preservation": { defaultValue: false, label: "Historic Preservation" },
	"capability_environmental": { defaultValue: false, label: "Environmental Protection" },
	"capability_risk_assessment": { defaultValue: false, label: "Risk Assessment" },
	"capability_administer_funding": { defaultValue: false, label: "Administer Funding" },

	"funding_amount": { defaultValue: null, label: "Funding Amount Administered", instruction: "Only for programs/actions that provide funding"  },

	"capability_tech_support": { defaultValue: false, label: "Technical Support", instruction: "Select all that apply"  },
	"capability_construction": { defaultValue: false, label: "Construction" },
	"capability_outreach": { defaultValue: false, label: "Education / Outreach" },
	"capability_project_management": { defaultValue: false, label: "Project Management" },
	"capability_research": { defaultValue: false, label: "Research" },
	"capability_policy": { defaultValue: false, label: "Policy Framework" },
	"capability_regulatory": { defaultValue: false, label: "Regulatory" },
	"capability_resiliency": { defaultValue: false, label: "Resiliency" },

	"related_policy": { defaultValue: "", label: "Related Policy" },
	"url": { defaultValue: "", label: "Project URL" },
	"goal": { defaultValue: "", label: "Goals", instruction: "Select all that apply" },
	"objective": { defaultValue: "", label: "Objective" },
	
	"status": { defaultValue: [], label: "Status" },
	"admin": { defaultValue: [], label: "Location", instruction: "At what geographic scale is this program administered? Select all that apply"  },
	

	"priority": { defaultValue: "", label: "Priority" },

	"priority_1": { defaultValue: 0, label: "Priority Scoring: Probability of Acceptance by Population", instruction: "Priority Information is Only Applicable to New Actions" },
	"priority_2": { defaultValue: 0, label: "Priority Scoring: Funding Availability", instruction: "Priority Information is Only Applicable to New Actions" },
	"priority_3": { defaultValue: 0, label: "Priority Scoring: Probability of Matching Funds", instruction: "Priority Information is Only Applicable to New Actions" },
	"priority_4": { defaultValue: 0, label: "Priority Scoring: Benefit Cost Review", instruction: "Priority Information is Only Applicable to New Actions" },
	"priority_5": { defaultValue: 0, label: "Priority Scoring: Environmental Benefit", instruction: "Priority Information is Only Applicable to New Actions" },
	"priority_6": { defaultValue: 0, label: "Priority Scoring: Technical Feasibility", instruction: "Priority Information is Only Applicable to New Actions" },
	"priority_7": { defaultValue: 0, label: "Priority Scoring: Timeframe of implementation", instruction: "Priority Information is Only Applicable to New Actions" },

	"priority_total": { defaultValue: 0, label: "Priority Total" },

	"benefit_cost_analysis": { defaultValue: false, label: "Benefit Cost Analysis" },
	"engineering_required": { defaultValue: false, label: "Engineering Required" },
	"engineering_complete": { defaultValue: false, label: "Engineering Completed" },

	"type": { defaultValue: 'program', label: "Type (choose one)" },

	"municipality": { defaultValue: "", label: "Action Municipality" },
	"county": { defaultValue: "", label: "Action County" },

	"repetitive_loss": { defaultValue: false, label: "Repetitive Loss", instruction: "Check this if the Action or Program deals with repetitive loss properties" },

	"origin_plan_name": { defaultValue: null, label: "Origin: Plan Name" },
	"origin_plan_year": { defaultValue: null, label: "Origin: Plan Year" },

	"funding_received": { defaultValue: 0.00, label: "Funding Received to Date" },

	"design_percent_complete": { defaultValue: 0, label: "Design: % Complete" },
	"scope_percent_complete": { defaultValue: 0, label: "Scope: % Complete" },

	"status_proposed": { defaultValue: false, label: "Proposed" },

	"start_date": { defaultValue: null, label: "Start Date" },
	"completed_date": { defaultValue: null, label: "Completed Date" },

	"justification": { defaultValue: "", label: "Justification", instruction: "Select a justification for current status" },

}

export const JUSTIFICATION_META = {
  "lack_of_funding": { label: "Lack of Funding" },
  "funding_change": { label: "Funding Change "},
  "env_hist_preservation": { label: "Env. / Hist. Preservation" },
  "staffing": { label: "Staffing" },
  "public_support": { label: "Public Support" },
  "legal": { label: "Legal" },
  "fixed": { label: "Fixed or Otherwise Mitigated"},
  "priority_change": { label: "Priority Change" }
}
export const getJustificationLabel = id =>
	JUSTIFICATION_META[id] ? JUSTIFICATION_META[id].label : id

export const PRIORITY_META_DATA = {
	priority_1: {
		4: { label: "Likely to be endorsed by the entire population" },
		3: { label: "Of benefit only to those directly affected and would not adversely affect others" },
		2: { label: "Would be somewhat controversial with special interest groups or a small percentage of the population" },
		1: { label: "Would be strongly opposed by special interest groups or a significant percentage of the population" },
		0: { label: "Would be strongly opposed by nearly all of the population" },
	},
	priority_2: {
		4: { label: "Little to no direct expenses" },
		3: { label: "Can be funded by operating budget" },
		2: { label: "Grant funding identified" },
		1: { label: "Grant funding needed" },
		0: { label: "Potential funding source unknown" }
	},
	priority_3: {
		4: { label: "Funding match is available or funding match not required" },
		2: { label: "Partial funding match available" },
		0: { label: "No funding match available or funding match unknown" }
	},
	priority_4: {
		4: { label: "Likely to meet Benefit Cost Review" },
		2: { label: "Benefit Cost Review not required" },
		0: { label: "Benefit Cost Review unknown" }
	},
	priority_5: {
		4: { label: "Environmentally sound and relatively easy to implement; or no adverse impact on environment." },
		3: { label: "Environmentally acceptable and not anticipated to be difficult to implement" },
		2: { label: "Environmental concerns and somewhat difficult to implement because of complex requirements" },
		1: { label: "Difficult to implement because of significantly complex requirements and environmental permitting" },
		0: { label: "Very difficult to implement due to extremely complex requirements and environmental permitting problems" }
	},
	priority_6: {
		4: { label: "Proven to be technically feasible" },
		2: { label: "Expected to be technically feasible" },
		0: { label: "Technical feasibility unknown or additional information needed" }
	},
	priority_7: {
		4: { label: "1 year or less (Short Term)" },
		2: { label: "2 – 5 years (Long-Term)" },
		0: { label: "More than 5 years (Long-Term)" }
	}
}
export const getDefaultValue = attribute =>
	META_DATA[attribute] ? META_DATA[attribute].defaultValue : null;
export const getLabel = (attribute, score=null) => {
	if (score && (attribute in PRIORITY_META_DATA)) {
		return PRIORITY_META_DATA[attribute][score].label;
	}
	else {
		return META_DATA[attribute] ? META_DATA[attribute].label : attribute
	}
}
export const getInstructions = attribute =>
	META_DATA[attribute] ? META_DATA[attribute].instruction : null

export const GOAL_METADATA = [
	{ cat: "Federal, State, and Local Coordination",
		goals: [
			{ goal: "1.1",
				desc: "Promote integrated land use planning and development to encourage resilience and sustainability through statewide programs that address zoning, building codes, smart growth, capital improvement programs, open space preservation, critical infrastructure siting, and storm water management regulations."
			},
			{ goal: "1.2",
				desc: "Continue to participate in state and local programs and efforts that focus on practices that support or enhance resiliency."
			},
			{	goal: "1.3",
				desc: "Improve hazard data through studies, research, and mapping to enhance information related to the impacts of hazards and related risks, vulnerability, and losses."
			}
		]
	},

	{ cat: "Protect Existing Properties",
		goals: [
			{ goal: "2.1",
				desc: "Encourage homeowners, renters, and businesses to insure property for all hazards, including flood coverage under the National Flood Insurance Program (NFIP)."
			},
			{ goal: "2.2",
				desc: "Identify mitigation opportunities to protect, upgrade and strengthen existing structures from all-hazards through acquisition, elevation, relocation, and retrofit."
			},
			{ goal: "2.3",
				desc: "Encourage resilient and sustainable structural practices that reduce vulnerabilities and encourage the use of green and natural infrastructure."
			},
			{ goal: "2.4",
				desc: "Promote the continued use of natural systems and features, open space preservation, and land use development planning with local jurisdictions.",
			},
			{ goal: "2.5",
				desc: "Acquire, retrofit, or relocate repetitive loss properties from hazard-prone areas in the state."
			}
		]
	},

	{ cat: "Increase Awareness",
		goals: [
			{ goal: "3.1",
				desc: "Offer trainings, education, technical support and awareness programs to better utilize funding opportunities and integrate mitigation into ongoing planning efforts and program functions."
			},
			{ goal: "3.2",
				desc: "Offer dedicated education and awareness programs to reduce the impact of hazards on vulnerable populations."
			},
			{ goal: "3.3",
				desc: "Continue to develop and improve systems that provide warning, awareness, and emergency communication."
			},
			{ goal: "3.4",
				desc: "Inventory, evaluate, and build state, and local capacity for risk reduction."
			}
		]
	},

	{ cat: "Preserve or Restore Natural Systems",
		goals: [
			{ goal: "4.1",
				desc: "Encourage the use of green and natural infrastructure."
			},
			{ goal: "4.2",
				desc: "Provide technical assistance to communities and stakeholders in the application and implementation of mitigation projects that preserve or restore natural systems."
			},
			{ goal: "4.3",
				desc: "Maintain and encourage ongoing relationships between state agencies and partners to play an active and vital role in preservation and restoration of vulnerable natural systems."
			},
			{ goal: "4.4",
				desc: "Facilitate, encourage, and manage retreat where appropriate."
			}
		]
	},

	{ cat: "Build Stronger",
		goals: [
			{ goal: "5.1",
				desc: "Encourage building and rebuilding practices that address resiliency through higher standards and sustainable design to resist impacts of natural hazards."
			},
			{ goal: "5.2",
				desc: "Enhance coordination with state and local agencies that promote resiliency and sustainability."
			},
			{ goal: "5.3",
				desc: "Identify sustainable flood and erosion control projects and activities that demonstrate resiliency practices."
			},
			{ goal: "5.4",
				desc: "Provide assistance in the implementation of flood mitigation plans and projects in flood-prone areas, in accordance with federal and state regulatory, funding, and technical assistance programs. Pursuing these goals and objectives will allow the State to achieve the ideal described in the State’s Hazard Mitigation Vision Statement."
			}
		]
	}
]

export const receiveCapabilities = capabilities =>
	dispatch => (
		dispatch({
			type: RECEIVE_CAPABILITIES,
			capabilities
		}), Promise.resolve())

export const updateCapability = capability =>
	dispatch => (
		dispatch({
			type: UPDATE_CAPABILITY,
			capability
		}), Promise.resolve())

export const receiveHazards = hazards =>
	dispatch => (
		dispatch({
			type: RECEIVE_HAZARDS,
			hazards
		}), Promise.resolve())

export const receiveAgencies = agencies =>
	dispatch => (
		dispatch({
			type: RECEIVE_AGENCIES,
			agencies
		}), Promise.resolve())

export const toggleHazardFilter = hazard =>
	dispatch => (
		dispatch({
			type: TOGGLE_HAZARD_FILTER,
			hazard
		}), Promise.resolve())
export const toggleAgencyFilter = agency =>
	dispatch => (
		dispatch({
			type: TOGGLE_AGENCY_FILTER,
			agency
		}), Promise.resolve())
export const toggleTypeFilter = ct =>
	dispatch => (
		dispatch({
			type: TOGGLE_TYPE_FILTER,
			ct
		}), Promise.resolve())

export const setCapabilityData = capabilityData =>
	dispatch => (
		dispatch({
			type: SET_CAPABILITY_DATA,
			capabilityData
		}), Promise.resolve())
export const clearCapabilityData = () =>
	dispatch => (
		dispatch({
			type: CLEAR_CAPABILITY_DATA
		}), Promise.resolve())

const INITIAL_STATE = {
	capabilities: [],
	capabilityData: {},
	hazardFilters: [],
	hazards: [],
	agencyFilters: [],
	agencies: [],
	typeFilters: [],
	types: ['program', 'measure', 'action']
}

ATTRIBUTES.forEach(att => {
	INITIAL_STATE.capabilityData[att] = getDefaultValue(att)
})

export default (state=INITIAL_STATE, action) => {
	switch (action.type) {
		case RECEIVE_CAPABILITIES:
			return {
				...state,
				capabilities: action.capabilities
			};
		case UPDATE_CAPABILITY:
			const capabilities = state.capabilities.filter(d => d.id !== action.capability.id);
			capabilities.push(action.capability);
			return {
				...state,
				capabilities
			}
		case RECEIVE_HAZARDS:
			return {
				...state,
				hazards: action.hazards
			}
		case TOGGLE_HAZARD_FILTER:
			let hazardFilters = state.hazardFilters.slice();
			if (!hazardFilters.includes(action.hazard)) {
				hazardFilters.push(action.hazard);
			}
			else {
				hazardFilters = hazardFilters.filter(h => h !== action.hazard)
			}
			return {
				...state,
				hazardFilters
			}
		case TOGGLE_AGENCY_FILTER:
			let agencyFilters = state.agencyFilters.slice();
			if (!agencyFilters.includes(action.agency)) {
				agencyFilters.push(action.agency);
			}
			else {
				agencyFilters = agencyFilters.filter(a => a !== action.agency)
			}
			return {
				...state,
				agencyFilters
			}
		case TOGGLE_TYPE_FILTER:
			let typeFilters = state.typeFilters.slice();
			if (!typeFilters.includes(action.ct)) {
				typeFilters.push(action.ct);
			}
			else {
				typeFilters = typeFilters.filter(a => a !== action.ct)
			}
			return {
				...state,
				typeFilters
			}
		case SET_CAPABILITY_DATA:
			return {
				...state,
				capabilityData: action.capabilityData
			}
		case CLEAR_CAPABILITY_DATA:
			return {
				...state,
				capabilityData: INITIAL_STATE.capabilityData
			}
		case RECEIVE_AGENCIES:
			return {
				...state,
				agencies: action.agencies
			}
		default:
			return state;
	}
}