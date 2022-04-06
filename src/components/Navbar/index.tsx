import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { Container, Navbar as BootstrapNavbar } from 'react-bootstrap'
import Authenticate from 'components/Authenticate'

interface Props {
  sidebarOpened: boolean
  toggleSidebar: () => void
}

const Navbar: React.FC<Props> = ({ sidebarOpened, toggleSidebar }) => {
  const [color, setcolor] = useState('navbar-transparent')

  useEffect(() => {
    window.addEventListener('resize', updateColor)
    // Specify how to clean up after this effect:
    return function cleanup() {
      window.removeEventListener('resize', updateColor)
    }
  })

  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => {
    if (window.innerWidth < 993 && sidebarOpened) {
      setcolor('bg-white')
    } else {
      setcolor('navbar-transparent')
    }
  }

  return (
    <BootstrapNavbar className={classNames('navbar-absolute', color)} expand="lg">
      <Container fluid>
        <div className="navbar-wrapper">
          <BootstrapNavbar.Brand href="/projects" style={{ padding: 0 }}>
            <div className="logo-box-area">
              <img className="header-logo-main" src="/img/onlypsi.png" alt="" />
              <p>PSI PAD</p>
            </div>
          </BootstrapNavbar.Brand>

          <BootstrapNavbar.Toggle
            className={classNames('navbar-toggle d-inline', {
              toggled: sidebarOpened,
            })}
            onClick={toggleSidebar}
          />
        </div>

        <BootstrapNavbar.Collapse className="mobile-collapse-show justify-content-end">
          <Authenticate />
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  )
}

export default Navbar
