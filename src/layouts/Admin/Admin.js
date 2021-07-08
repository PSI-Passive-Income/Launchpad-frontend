
import React from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";

// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import routes from "routes.js";

import logo from "assets/img/anime3.png";
import { BackgroundColorContext } from "contexts/BackgroundColorContext";

var ps;

function Admin(props) {
  const location = useLocation();
  const mainPanelRef = React.useRef(null);
  const [sidebarOpened, setsidebarOpened] = React.useState(
      document.documentElement.className.indexOf("nav-open") !== -1
  );

  // this function opens and closes the sidebar on small devices
  const toggleSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    setsidebarOpened(!sidebarOpened);
  };
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
            <Route
                path={prop.layout + prop.path}
                component={prop.component}
                key={key}
            />
        );
      } else {
        return null;
      }
    });
  };
  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  return (
      <BackgroundColorContext.Consumer>
        {({ color, changeColor }) => (
            <React.Fragment>
              <div className="wrapper">
                <Sidebar
                    routes={routes}
                    logo={{
                      outterLink: "https://www.creative-tim.com/",
                      text: "Creative Tim",
                      imgSrc: logo,
                    }}
                    toggleSidebar={toggleSidebar}
                />
                <div className="main-panel" ref={mainPanelRef} data={color}>
                  <AdminNavbar
                      brandText={getBrandText(location.pathname)}
                      toggleSidebar={toggleSidebar}
                      sidebarOpened={sidebarOpened}
                  />
                  <Switch>
                    {getRoutes(routes)}
                    <Redirect from="*" to="/admin/dashboard" />
                  </Switch>
                  {
                    // we don't want the Footer to be rendered on map page
                    location.pathname === "/admin/maps" ? null : <Footer fluid />
                  }
                </div>
              </div>
              <FixedPlugin bgColor={color} handleBgClick={changeColor} />
            </React.Fragment>
        )}
      </BackgroundColorContext.Consumer>
  );
}

export default Admin;