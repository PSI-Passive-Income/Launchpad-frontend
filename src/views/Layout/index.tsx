import React, { lazy } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import { routes } from 'routes'
import Navbar from 'components/Navbar'
import Footer from 'components/Footer/Footer'
import Sidebar from 'components/Sidebar/Sidebar'
import logo from 'assets/img/anime3.png'

const NotFound = lazy(() => import('../NotFound'))

const Layout: React.FC = () => {
  const location = useLocation()
  const mainPanelRef = React.useRef(null)
  const [sidebarOpened, setsidebarOpened] = React.useState(
    document.documentElement.className.indexOf('nav-open') !== -1,
  )

  // this function opens and closes the sidebar on small devices
  const toggleSidebar = () => {
    document.documentElement.classList.toggle('nav-open')
    setsidebarOpened(!sidebarOpened)
  }

  const allRoutes = routes.map((prop) => {
    return <Route key={prop.path} path={prop.path} component={prop.component} exact={prop.exact} />
  })

  return (
    <div className="wrapper">
      <Sidebar
        routes={routes}
        logo={{
          outterLink: '#',
          text: 'Psi Launchpad',
          imgSrc: logo,
        }}
        toggleSidebar={toggleSidebar}
      />
      <div className="main-panel" ref={mainPanelRef}>
        <Navbar brandText="asd" toggleSidebar={toggleSidebar} sidebarOpened={sidebarOpened} />
        <Switch>
          {allRoutes}
          {/* <Redirect from="*" to="/admin/explore-projects" /> */}
          <Route component={NotFound} />
        </Switch>
        {
          // we don't want the Footer to be rendered on map page
          location.pathname === '/admin/maps' ? null : <Footer fluid />
        }
      </div>
    </div>
  )
}

export default Layout
