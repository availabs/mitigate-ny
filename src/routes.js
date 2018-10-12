
// -- Landing Routes
import Landing from './pages/Landing'
// import PublicPlan from './pages/PublicPlan'

// -- Private Routes
import RiskIndex from './pages/auth/RiskIndex'
import Hazard from './pages/auth/RiskIndex/Hazard'
import Risk from './pages/auth/Vulnerabilities/Risk'
import Vulnerabilities from "./pages/auth/Vulnerabilities/Vulnerabilities"
import CMS from "./pages/auth/cms"
import NewContentPage from "./pages/auth/cms/NewContentPage"
import Plan from "pages/auth/SHMP"
import Strategies from "pages/auth/Strategies"
import Process from "pages/auth/Process"

import Capabilities from "pages/auth/Capabilities"
import About from "pages/auth/About/About"
import Compare from "pages/auth/RiskIndex/Compare"
import TestPage from "pages/auth/test_components/TestPage"
import CountyPage from "pages/auth/RiskIndex/CountyPage"
import Local from "pages/auth/Local/local"
import ManageCapabilities from "pages/auth/Capabilities/manage"
import NewCapability from "pages/auth/Capabilities/manage/NewCapability"

import FloodExplorer from "pages/auth/FloodExplorer"

import Comments from "pages/comments"

// -- Util Routes
import Login from './pages/Login'
import Logout from './pages/Logout'
import NoMatch from './pages/404.js'

const routes = [
  Landing,
  ...RiskIndex,
  ...Hazard,
  ...Risk,
  ...Vulnerabilities,
  ...CMS,
  ...NewContentPage,
  ...Process,
  ...Capabilities,
  ...Strategies,
  ...Local,
  ...Compare,
  ...Plan,
  ...TestPage,
  ...CountyPage,
  ...About,
  ...ManageCapabilities,
  ...NewCapability,
 
 ...Comments,
  
  FloodExplorer,

  Login,
  Logout,
  NoMatch
]


export default routes