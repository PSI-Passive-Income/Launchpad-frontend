import React from 'react'
import { useCampaigns, useLoggedInUser } from 'state/hooks'
import { useGlobalLoader } from 'components/Loader'
import { isEmpty } from 'lodash'
import { Table } from 'react-bootstrap'
import DetailContribution from './contributionDetail'

const ContributionDetail: React.FC = () => {
  const { campaigns, campaignsLoading } = useCampaigns()
  const { accessToken, account } = useLoggedInUser()

  useGlobalLoader(campaignsLoading)

  return (
    <div className="content">
      <div className="card">
        {account && accessToken ? (
          <Table variant="dark">
            {!campaignsLoading ? (
              <thead>
                <tr>
                  <th>campaign Address</th>
                  <th>Token Name</th>
                  <th>Token Address</th>
                  <th>contributed Value</th>
                  <th>campaign status</th>
                </tr>
              </thead>
            ) : null}
            {!campaignsLoading && !isEmpty(campaigns)
              ? Object.values(campaigns).map((campaign: any) => {
                  return <DetailContribution campaign={campaign} />
                })
              : null}
          </Table>
        ) : (
          <h3 className="KYC-box text-center">Please connect wallet</h3>
        )}
      </div>
    </div>
  )
}
export default ContributionDetail
