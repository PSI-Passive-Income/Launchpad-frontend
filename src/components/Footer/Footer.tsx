import React from 'react'
import { Container } from 'reactstrap'

interface Props {
  fluid?: boolean | string
}

const Footer: React.FC<Props> = ({ fluid }) => (
  <footer className="footer">
    <Container fluid={fluid}>
      <div className="copyright">© {new Date().getFullYear()} Passive Income </div>
    </Container>
  </footer>
)

export default Footer
