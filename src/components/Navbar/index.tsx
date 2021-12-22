import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { Collapse, NavbarBrand, Navbar as BootstrapNavbar, Nav, Container, NavbarToggler } from 'reactstrap'
import Authenticate from 'components/Authenticate'

interface Props {
  brandText: string
  sidebarOpened: boolean
  toggleSidebar: () => void
}

const Navbar: React.FC<Props> = ({ brandText, sidebarOpened, toggleSidebar }) => {
  const [collapseOpen, setcollapseOpen] = useState(false)
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
    if (window.innerWidth < 993 && collapseOpen) {
      setcolor('bg-white')
    } else {
      setcolor('navbar-transparent')
    }
  }

  // this function opens and closes the collapse on small devices
  const toggleCollapse = () => {
    if (collapseOpen) {
      setcolor('navbar-transparent')
    } else {
      setcolor('bg-white')
    }
    setcollapseOpen(!collapseOpen)
  }

  return (
    <>
      <BootstrapNavbar className={classNames('navbar-absolute', color)} expand="lg">
        <Container fluid>
          <div className="navbar-wrapper">
            <div
              className={classNames('navbar-toggle d-inline', {
                toggled: sidebarOpened,
              })}
            >
              <NavbarToggler onClick={toggleSidebar}>
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </NavbarToggler>
            </div>
            <NavbarBrand href="/projects" >
                <div className='logo-box-area'>
                  <img className="header-logo-main" src="/img/onlypsi.png" alt="" />
                  <p>PSI PAD</p>
                </div>
            </NavbarBrand>
          </div>
          {/* <NavbarToggler onClick={toggleCollapse}>
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
          </NavbarToggler> */}
          <Collapse navbar className="mobile-collapse-show">
            <Nav className="ml-auto" navbar>
              <Authenticate />
              {/* <FormGroup>
                <Input type="select" name="select" id="exampleSelect" className="network-class">
                  <option>Binance Smart Chain</option>
                  <option>Ethereum Network</option>
                </Input>
              </FormGroup> */}
            </Nav>
          </Collapse>
        </Container>
      </BootstrapNavbar>
    </>
  )
}

export default Navbar
