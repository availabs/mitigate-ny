import riskIndexAPI from 'store/data-adapters/riskIndexApi' 

let risKAPI = new riskIndexAPI();
// ------------------------------------
// Constants
// ------------------------------------
const SET_HAZARD_DETAIL = 'SET_HAZARD_DETAIL';
const SET_HAZARD_TOTAL = 'SET_HAZARD_TOTAL';

const HAZARD_META = {
  'WIND':{name:'Wind'},
  'WILDFIRE':{name:'Wildfire'},
  'TSUNAMI':{name:'Tsunami'},
  'TORNADO':{name:'Tornado'},
  'RIVERINE':{name:'Riverine Flooding'},
  'LIGHTNING':{name:'Lightning'},
  'LANDSLIDE':{name:'Landslide'},
  'ICESTORM':{name:'Ice Storm'},
  'HURRICANE':{name:'Hurricane'},
  'HEATWAVE':{name:'Heat Wave'},
  'HAIL':{name:'Hail'},
  'EARTHQUAKE':{name:'Earthquake'},
  'DROUGHT':{name:'Drought'},
  'AVALANCHE':{name:'Avalanche'},
  'COLDWAVE':{name:'Coldwave'},
  'WINTERWEAT':{name:'Snow Storm'},
  'VOLCANO':{name:'Volcano'},
  'COASTAL':{name:'Costal Flooding'}
}
// ------------------------------------
// Actions
// ------------------------------------
function setHazardTotal(geoid, data) {
  return {
    type: SET_HAZARD_TOTAL,
    geoid,
    data
  };
}

function setHazardDetail(geoid, data, geoType) {
  return {
    type: SET_HAZARD_DETAIL,
    geoid,
    data,
    geoType
  };
}

export const getHazardTotal = (geoid) => {
  return dispatch => {
    return risKAPI.getHazardTotal(geoid).then(data => {
      dispatch(setHazardTotal(geoid,data))
    })
  } 
};

export const getHazardDetail = (geoid, geoType) => {
  geoType = geoType ? geoType : 'counties'
  return dispatch => {
    return risKAPI.getHazardDetail(geoid, geoType).then(data => {
      dispatch(setHazardDetail(geoid, data, geoType))
    })
  } 
};

// export const actions = {
//   getHazardTotal
// };


// -------------------------------------
// Initial State
// -------------------------------------
let initialState = {
  meta: HAZARD_META
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_HAZARD_TOTAL]: (state, action) => {
    let newState = Object.assign({}, state);
    // add data to geoid  
    newState[action.geoid] = action.data;
    return newState;
  },
  [SET_HAZARD_DETAIL]: (state = initialState, action) => {
    let newState = Object.assign({}, state)
    let value  = Object.assign({}, state[action.geoid], {[action.geoType]:action.data})
    
    newState[action.geoid] = value
    return newState;
  }
};

export default function riskIndexReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}