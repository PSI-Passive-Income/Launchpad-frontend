import React, { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { IRoute } from 'routes'
import PerfectScrollbar from 'perfect-scrollbar'
import { Nav } from 'react-bootstrap'

let perfectScrollBar = null

interface Props {
  routes: IRoute[]
  toggleSidebar: () => void
}

const Sidebar: React.FC<Props> = ({ routes, toggleSidebar }) => {
  const location = useLocation()
  const sidebarRef = React.useRef(null)

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName: string) => {
    return location.pathname === routeName ? 'active' : ''
  }

  useEffect(() => {
    if (navigator.platform.indexOf('Win') > -1) {
      perfectScrollBar = new PerfectScrollbar(sidebarRef.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      })
    }
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf('Win') > -1) {
        perfectScrollBar.destroy()
      }
    }
  })

  return (
    <div className="sidebar" data-type="psi">
      <div className="sidebar-wrapper" ref={sidebarRef}>
        <Nav>
          {routes.map((prop) => {
            if (!prop.name) return null
            return (
              <li className={activeRoute(prop.path)} key={prop.path}>
                <NavLink
                  to={prop.path}
                  onClick={toggleSidebar}
                  className={({ isActive }) => `nav-link ${isActive ? ' active' : ''}`}
                >
                  <i className={prop.icon} />
                  <p>{prop.name}</p>
                </NavLink>
              </li>
            )
          })}
        </Nav>
      </div>
    </div>
  )
}

export default Sidebar
