import React, { useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { IRoute } from 'routes'
import PerfectScrollbar from 'perfect-scrollbar'
import { Nav } from 'reactstrap'

let perfectScrollBar = null

interface Props {
  routes: IRoute[]
  logo: {
    innerLink?: string
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink?: string
    // the text of the logo
    text?: React.ReactNode
    // the image src of the logo
    imgSrc?: string
  }
  toggleSidebar: () => void
}

const Sidebar: React.FC<Props> = ({ routes, logo, toggleSidebar }) => {
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

  let logoImg = null
  let logoText = null
  if (logo !== undefined) {
    if (logo.outterLink !== undefined) {
      logoImg = (
        <a href={logo.outterLink} className="simple-text logo-mini" target="_blank" onClick={toggleSidebar} rel="noreferrer">
          <div className="logo-img">
            <img src={logo.imgSrc} alt="react-logo" />
          </div>
        </a>
      )
      logoText = (
        <a href={logo.outterLink} className="simple-text logo-normal" target="_blank" onClick={toggleSidebar} rel="noreferrer">
          {logo.text}
        </a>
      )
    } else {
      logoImg = (
        <Link to={logo.innerLink} className="simple-text logo-mini" onClick={toggleSidebar}>
          <div className="logo-img">
            <img src={logo.imgSrc} alt="react-logo" />
          </div>
        </Link>
      )
      logoText = (
        <Link to={logo.innerLink} className="simple-text logo-normal" onClick={toggleSidebar}>
          {logo.text}
        </Link>
      )
    }
  }

  return (
    <div className="sidebar" data-type="psi">
      <div className="sidebar-wrapper" ref={sidebarRef}>
        <Nav>
          {routes.map((prop) => {
            if (prop.redirect || !prop.name) return null
            return (
              <li className={activeRoute(prop.path)}>
                <NavLink
                  to={prop.path}
                  className="nav-link"
                  activeClassName="active"
                  onClick={toggleSidebar}
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
