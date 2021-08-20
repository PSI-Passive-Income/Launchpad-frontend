import React from 'react'
import CampaignCard from './CampaignCard'
import LaunchCampaignForm from './LaunchCampaignForm'

const LaunchCampaign: React.FC = () => (
  <div className="content">
    <div className="row">
      <div className="col-md-8">
        <LaunchCampaignForm />
      </div>
      <div className="col-md-4">
        <CampaignCard />
      </div>
    </div>
  </div>
)

export default LaunchCampaign
