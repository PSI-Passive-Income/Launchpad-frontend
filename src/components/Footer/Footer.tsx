import React from 'react'
import { Container } from 'reactstrap'

interface Props {
  fluid?: boolean | string
}

const Footer: React.FC<Props> = ({ fluid }) => (
  <footer className="footer">
    <Container fluid={fluid}>
      <div className="copyright">© {new Date().getFullYear()} Passive Income </div>
      <a href='/Disclaimer'>Disclaimer</a>
      <br/>
      <a href='/Policy'>Privacy Policy</a>
    </Container>
  </footer>
)

export default Footer
