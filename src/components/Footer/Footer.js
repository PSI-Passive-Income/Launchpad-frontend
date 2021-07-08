
/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container, Nav, NavItem, NavLink } from "reactstrap";

function Footer() {
  return (
    <footer className="footer">
      <Container fluid>

        <div className="copyright">
          © {new Date().getFullYear()} Passive Income{" "}

        </div>
      </Container>
    </footer>
  );
}

export default Footer;
