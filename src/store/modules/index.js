import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import user from './user';
import map from '../../modules/map';
export default combineReducers({
  user,
  map,
  routing: routerReducer
});
