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
            <NavbarBrand href="#pablo" onClick={(e) => e.preventDefault()}>
              {brandText}
            </NavbarBrand>
          </div>
          <NavbarToggler onClick={toggleCollapse}>
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
          </NavbarToggler>
          <Collapse navbar isOpen={collapseOpen}>
            <Nav className="ml-auto" navbar>
              <Authenticate />
              {/* {authedUser.authedUser ? (
                <>
                  <p className="align-self-center">{authedUser.authedUser}</p>
                  <Button
                    color="info"
                    id="1"
                    size="sm"
                    className="btn-simple active wallet-button"
                    onClick={LogoutMetamaskWallet}
                  >
                    LOCK
                  </Button>
                </>
              ) : (
                <>
                  <Button color="info" id="1" size="sm" className="btn-simple active wallet-button" onClick={toggle}>
                    + CONNECT
                  </Button>
                  <Modal isOpen={modal} toggle={toggle} className={className}>
                    <ModalHeader toggle={toggle}>Connect To A Wallet</ModalHeader>
                    <ModalBody>
                      <div className="single-wallet-box" onClick={metamask_wallet}>
                        <div className="single-wallet-btn">
                          Metamask
                          <div className="single-wallet-img">
                            <img src={metamaskicon} alt="" />
                          </div>
                        </div>
                      </div>

                      <div className="connect-info">
                        <p>
                          <i className="fa fa-info"></i>
                          Learn how to Connect?
                        </p>
                      </div>
                    </ModalBody>
                  </Modal>
                </>
              )}
              <FormGroup>
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