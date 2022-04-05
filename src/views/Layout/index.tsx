import React from 'react'
import { useRoutes } from 'react-router-dom'
import { routes } from 'routes'
import Navbar from 'components/Navbar'
import Footer from 'components/Footer/Footer'
import Sidebar from 'components/Sidebar/Sidebar'

const Layout: React.FC = () => {
  const applicationRoutes = useRoutes(routes)

  const mainPanelRef = React.useRef(null)
  const [sidebarOpened, setsidebarOpened] = React.useState(
    document.documentElement.className.indexOf('nav-open') !== -1,
  )

  // this function opens and closes the sidebar on small devices
  const toggleSidebar = () => {
    document.documentElement.classList.toggle('nav-open')
    setsidebarOpened(!sidebarOpened)
  }

  return (
    <div className="wrapper">
      <Sidebar routes={routes} toggleSidebar={toggleSidebar} />
      <div className="main-panel" ref={mainPanelRef}>
        <Navbar toggleSidebar={toggleSidebar} sidebarOpened={sidebarOpened} />
        {applicationRoutes}
        <Footer fluid />
      </div>
    </div>
  )
}

export default Layout
