import { createStore, combineReducers, applyMiddleware } from 'redux'
import {  routerReducer, routerMiddleware } from 'react-router-redux'

import user from './modules/user'
import riskIndex from './modules/riskIndex'
import geo from './modules/geo'

import createHistory from 'history/createBrowserHistory'
import thunk from 'redux-thunk'

// if (process.env.NODE_ENV === 'development') {
//   const devToolsExtension = window.devToolsExtension;

//   if (typeof devToolsExtension === 'function') {
//     enhancers.push(devToolsExtension());
//   }
// }

const history = createHistory()

// Build the middleware for intercepting and dispatching navigation actions
const middleware = [
	routerMiddleware(history),
	thunk
]


const store = createStore(
  combineReducers({
    user,
    riskIndex,
    geo,
    router: routerReducer
  }),
  applyMiddleware(...middleware)
)

export default store
export {
	history
}