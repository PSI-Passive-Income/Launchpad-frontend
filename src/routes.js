
import  Dashboard  from "views/Dashboard.js";
import Icons from "views/Icons.js";
import  launchProject  from "views/launch-project.js";
import Map from "views/Map.js";
import Notifications from "views/Notifications.js";
import Rtl from "views/Rtl.js";
import TableList from "views/TableList.js";
import Typography from "views/Typography.js";
import UserProfile from "views/UserProfile.js";
import ExploreProject from "views/explore-projects.js";
import CreateToken from "views/create-token.js";
import LockToken from "./views/lock-tokens";


var routes = [
  {
    path: "/explore-projects",
    name: "EXPLORE PROJECTS",
    rtlName: "خرائط",
    icon: "tim-icons icon-pin",
    component: ExploreProject,
    layout: "/admin",
  },
    {
    path: "/create-token",
    name: "Create Token",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-coins",
    component: CreateToken,
    layout: "/admin",
  },
  {
    path: "/launch-Project",
    name: "LAUNCH YOUR PROJECT",
    rtlName: "الرموز",
    icon: "tim-icons icon-spaceship",
    component: launchProject,
    layout: "/admin",
  },
  {
    path: "/lock-tokens",
    name: "Lock Tokens",
    rtlName: "الرموز",
    icon: "tim-icons icon-lock-circle",
    component: LockToken,
    layout: "/admin",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin",
  }
];
export default routes;
