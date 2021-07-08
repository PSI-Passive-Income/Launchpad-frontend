import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
import metamaskicon from '../../assets/img/metamask.png'
import {render, h} from "preact";

// reactstrap components
import {
    Button,
    Collapse,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Input,
    InputGroup,
    NavbarBrand,
    Navbar,
    NavLink,
    Nav,
    Container,
    Modal,
    NavbarToggler,
    ModalHeader, ButtonDropdown, Dropdown, FormGroup, Label, Col, ModalFooter, ModalBody,
} from "reactstrap";
import {useState} from "preact/hooks";

function AdminNavbar(props) {


    const [collapseOpen, setcollapseOpen] = React.useState(false);
    const [color, setcolor] = React.useState("navbar-transparent");
    React.useEffect(() => {
        window.addEventListener("resize", updateColor);
        // Specify how to clean up after this effect:
        return function cleanup() {
            window.removeEventListener("resize", updateColor);
        };
    });
    // function that adds color white/transparent to the navbar on resize (this is for the collapse)
    const updateColor = () => {
        if (window.innerWidth < 993 && collapseOpen) {
            setcolor("bg-white");
        } else {
            setcolor("navbar-transparent");
        }
    };
    // this function opens and closes the collapse on small devices
    const toggleCollapse = () => {
        if (collapseOpen) {
            setcolor("navbar-transparent");
        } else {
            setcolor("bg-white");
        }
        setcollapseOpen(!collapseOpen);
    };
    const {
        className
    } = props;

    const [modal, setModal] = React.useState(false);

    const toggle = () => setModal(!modal);
    return (
        <>
            <Navbar className={classNames("navbar-absolute", color)} expand="lg">
                <Container fluid>
                    <div className="navbar-wrapper">
                        <div
                            className={classNames("navbar-toggle d-inline", {
                                toggled: props.sidebarOpened,
                            })}
                        >
                            <NavbarToggler onClick={props.toggleSidebar}>
                                <span className="navbar-toggler-bar bar1"/>
                                <span className="navbar-toggler-bar bar2"/>
                                <span className="navbar-toggler-bar bar3"/>
                            </NavbarToggler>
                        </div>
                        <NavbarBrand href="#pablo" onClick={(e) => e.preventDefault()}>
                        </NavbarBrand>
                    </div>
                    <NavbarToggler onClick={toggleCollapse}>
                        <span className="navbar-toggler-bar navbar-kebab"/>
                        <span className="navbar-toggler-bar navbar-kebab"/>
                        <span className="navbar-toggler-bar navbar-kebab"/>
                    </NavbarToggler>
                    <Collapse navbar isOpen={collapseOpen}>
                        <Nav className="ml-auto" navbar>

                            <Button
                                color="info"
                                id="1"
                                size="sm"
                                className="btn-simple active wallet-button"
                                onClick={toggle}
                            >
                                + CONNECT
                            </Button>
                            <Modal isOpen={modal} toggle={toggle} className={className}>
                                <ModalHeader toggle={toggle}>Connect To A Wallet</ModalHeader>
                                <ModalBody>
                                    <div className="single-wallet-box">
                                        <div className="single-wallet-btn">
                                            Metamask
                                            <div className="single-wallet-img">
                                            <img src={metamaskicon} alt=""/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="single-wallet-box">
                                        <div className="single-wallet-btn">
                                            Trustwallet
                                            <div className="single-wallet-img">
                                                <img src={metamaskicon} alt=""/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="single-wallet-box">
                                        <div className="single-wallet-btn">
                                            MathWallet
                                            <div className="single-wallet-img">
                                                <img src={metamaskicon} alt=""/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="single-wallet-box">
                                        <div className="single-wallet-btn">
                                            TokenPocket
                                            <div className="single-wallet-img">
                                                <img src={metamaskicon} alt=""/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="single-wallet-box">
                                        <div className="single-wallet-btn">
                                            WalletConnect
                                            <div className="single-wallet-img">
                                                <img src={metamaskicon} alt=""/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="single-wallet-box">
                                        <div className="single-wallet-btn">
                                            Binance Chain Wallet
                                            <div className="single-wallet-img">
                                                <img src={metamaskicon} alt=""/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="single-wallet-box">
                                        <div className="single-wallet-btn">
                                            SafePal Wallet
                                            <div className="single-wallet-img">
                                                <img src={metamaskicon} alt=""/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="connect-info">

                                        <p><i className="fa fa-info">
                                        </i>
                                            Learn how to Connect?</p>
                                    </div>
                                </ModalBody>


                            </Modal>
                            <FormGroup>
                                <Input type="select" name="select" id="exampleSelect" className="network-class">
                                    <option>Binance Smart Chain</option>
                                    <option>Ethereum Network</option>
                                </Input>
                            </FormGroup>
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>

        </>
    );
}

export default AdminNavbar;