const RECEIVE_CAPABILITIES = "RECEIVE_CAPABILITIES",
	UPDATE_CAPABILITY = "UPDATE_CAPABILITY",

	RECEIVE_HAZARDS = "RECEIVE_HAZARDS",

	RECEIVE_AGENCIES = "RECEIVE_AGENCIES",

	TOGGLE_HAZARD_FILTER = "TOGGLE_HAZARD_FILTER",
	TOGGLE_AGENCY_FILTER = "TOGGLE_AGENCY_FILTER",

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
	"capability_funding_amount",
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

	"id",
	"created_at",
	"updated_at"
]
export const NEW_CAPABILITY_ATTRIBUTES = ATTRIBUTES.slice(0, ATTRIBUTES.length - 3);
export const META_DATA = {
	"name": { defaultValue: null, label: "Name" },
	"description": { defaultValue: null, label: "Description" },
	"contact": { defaultValue: null, label: "Contact" },
	"contact_email": { defaultValue: null, label: "Contact Email" },
	"contact_title": { defaultValue: null, label: "Contact Title" },
	"contact_department": { defaultValue: null, label: "Contact Department" },
	"agency": { defaultValue: null, label: "Agency" },
	"partners": { defaultValue: null, label: "Partners" },
	"status_new_shmp": { defaultValue: false, label: "New SHMP" },
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
	"budget_provided": { defaultValue: null, label: "Budget Provided" },
	"primary_funding": { defaultValue: null, label: "Primary Funding" },
	"secondary_funding": { defaultValue: null, label: "Secondary Funding" },
	"num_staff": { defaultValue: null, label: "Num. Staff" },
	"num_contract_staff": { defaultValue: null, label: "Num. Contract Staff" },
	"hazards": { defaultValue: [], label: "Hazards" },
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
	"capability_funding_amount": { defaultValue: false, label: "Funding Amount" },
	"capability_tech_support": { defaultValue: false, label: "Technical Support" },
	"capability_construction": { defaultValue: false, label: "Construction" },
	"capability_outreach": { defaultValue: false, label: "Education / Outreach" },
	"capability_project_management": { defaultValue: false, label: "Project Management" },
	"capability_research": { defaultValue: false, label: "Research" },
	"capability_policy": { defaultValue: false, label: "Policy Framework" },
	"capability_regulatory": { defaultValue: false, label: "Regulatory" },
	"capability_resiliency": { defaultValue: null, label: "Resiliency" },
	"related_policy": { defaultValue: null, label: "Related Policy" },
	"url": { defaultValue: null, label: "Project URL" },
	"goal": { defaultValue: null, label: "Goal" },
	"objective": { defaultValue: null, label: "Objective" },
	
	"status": { defaultValue: [], label: "Status" },
	"admin": { defaultValue: [], label: "Admin" },
	"priority": { defaultValue: null, label: "Priority"},
	"type": { defaultValue: null, label: "Type"},

	
	"priority_1": { defaultValue: null, label: "Priority 1" }, 
	"priority_2": { defaultValue: null, label: "Priority 2" },
	"priority_3": { defaultValue: null, label: "Priority 3" },
	"priority_4": { defaultValue: null, label: "Priority 4" },
	"priority_5": { defaultValue: null, label: "Priority 5" },
	"priority_6": { defaultValue: null, label: "Priority 6" },
	"priority_7": { defaultValue: null, label: "Priority 7" },
	"priority_total": { defaultValue: null, label: "Priority_Total" },
	"benefit_cost_analysis": { defaultValue: null, label: "BCA" },
	"engineering_required": { defaultValue: null, label: "Engineering Required" },
	"engineering_complete": { defaultValue: null, label: "Engineering Completed" },
	
	"municipality": {defaultValue: null, label: "Municipality" },
	"county": { defaultValue: null, label: "County" },
	
}
export const getDefaultValue = attribute =>
	META_DATA[attribute].defaultValue;
export const getLabel = attribute =>
	META_DATA[attribute].label

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
	capabilityData: {
		id: null,
		name: "",
		description: ""
	},
	hazardFilters: [],
	hazards: [],
	agencyFilters: [],
	agencies: []
}

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