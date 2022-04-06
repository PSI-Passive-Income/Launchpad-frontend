import React from 'react'
import { useToken } from 'state/hooks'
import { Campaign, CampaignStatus } from 'state/types'
import { isEmpty } from 'lodash'
import { formatBN } from 'utils/formatters'

interface Prop {
  campaign: Campaign
}

const ContributionDetail: React.FC<Prop> = ({ campaign }) => {
  const { token, isLoadingToken } = useToken(campaign?.tokenAddress)

  return !isLoadingToken && !isEmpty(token) ? (
    <tbody>
      <tr>
        <td>
          <a href={`/project/${campaign.campaignAddress}`}>{campaign.campaignAddress}</a>
        </td>
        <td>{token.name}</td>
        <td>{campaign.tokenAddress}</td>
        <td>{formatBN(campaign.userContributed)}</td>
        {campaign.status === CampaignStatus.Live ? (
          <td>
            <p style={{ color: '#09f95e' }}>Live</p>
          </td>
        ) : null}
        {campaign.status === CampaignStatus.Ended ? (
          <td>
            <p style={{ color: '#ffa500' }}>Ended</p>
          </td>
        ) : null}
        {campaign.status === CampaignStatus.Failed ? (
          <td>
            <p style={{ color: 'red' }}>Failed</p>
          </td>
        ) : null}
        {!campaign.status || campaign.status === CampaignStatus.NotStarted ? (
          <td>
            <p style={{ color: '#09b6f9' }}>Coming soon</p>
          </td>
        ) : null}
      </tr>
    </tbody>
  ) : null
}
export default ContributionDetail
