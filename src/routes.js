
// -- Landing Routes
import Landing from './pages/Landing'
// import PublicPlan from './pages/PublicPlan'

// -- Private Routes
import RiskIndex from './pages/auth/RiskIndex'
import Hazard from './pages/auth/RiskIndex/Hazard'

// -- Util Routes
import Login from './pages/Login'
import Logout from './pages/Logout'
import NoMatch from './pages/404.js'

const routes = [
  Landing,
  ...RiskIndex,
  ...Hazard,
  Login,
  Logout,
  NoMatch
]


export default routes