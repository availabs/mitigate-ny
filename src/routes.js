
// -- Landing Routes
import Landing from './pages/Landing'
// import PublicPlan from './pages/PublicPlan'

// -- Private Routes
import RiskIndex from './pages/auth/RiskIndex'
import Hazard from './pages/auth/RiskIndex/Hazard'
import Geography from './pages/auth/RiskIndex/Geography'
import Vulnerabilities from "./pages/auth/Vulnerabilities"

// -- Util Routes
import Login from './pages/Login'
import Logout from './pages/Logout'
import NoMatch from './pages/404.js'

const routes = [
  Landing,
  ...RiskIndex,
  ...Hazard,
  ...Geography,
  ...Vulnerabilities,
  Login,
  Logout,
  NoMatch
]


export default routes