import React from 'react'
import { Card } from 'react-bootstrap'
import logo from '../../assets/img/icons/project-default1.jpeg'

const CampaignCard: React.FC = () => (
  <div className="content">
    <Card className="card-user">
      <Card.Body>
        <p className="card-text" />
        <div className="author">
          <div className="block block-one" />
          <div className="block block-two" />
          <div className="block block-three" />
          <div className="block block-four" />
          <div>
            <img className="avatar" src={logo} alt="..." />
            <h5 className="title">{/* {{ project.tokenName }} - {{ project.tokenSymbol }} */}</h5>
          </div>
          <p className="card-description">{/* {{ project.description }} */}</p>
        </div>
      </Card.Body>
    </Card>
  </div>
)

export default CampaignCard
