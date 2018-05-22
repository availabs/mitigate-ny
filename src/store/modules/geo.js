import geoApi from 'store/data-adapters/geoApi' 

let geoData = new geoApi();
// ------------------------------------
// Constants
// ------------------------------------
const SET_CHILD_GEO = 'SET_CHILD_GEO';

// ------------------------------------
// Actions
// ------------------------------------
function setChildGeo(geoid, data, geoType) {
  return {
    type: SET_CHILD_GEO,
    geoid,
    data,
    geoType
  };
}

export const getChildGeo = (geoid, geoType) => {
  geoType = geoType ? geoType : 'counties'
  return dispatch => {
    return geoData.getChildGeo(geoid, geoType).then(data => {
      dispatch(setChildGeo(geoid,data, geoType))
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
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_CHILD_GEO]: (state = initialState, action) => {
    let newState = Object.assign({}, state);
    // add childGeo to previous state geoid
    let value  = Object.assign({}, state[action.geoid], {[action.geoType]: action.data})
    // then set the geoid equal to the expanded value
    newState[action.geoid] = value
    return newState;
  }
};

export default function riskIndexReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}