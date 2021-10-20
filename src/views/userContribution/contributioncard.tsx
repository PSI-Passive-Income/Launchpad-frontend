import React from 'react'
import { useCampaigns, useToken } from 'state/hooks'
import Loader from 'components/Loader'
import { isEmpty } from 'lodash'
import { formatBN } from 'utils/formatters'
import { Label, Table } from 'reactstrap'
import DetailContribution from './contributionDetail'



const ContributionDetail: React.FC = () => {

    const { campaigns, campaignsLoading } = useCampaigns()

    return (
        <div className="content">
            <Loader loading={campaignsLoading} />
            <div className="card">

                <Table dark>
                    {!campaignsLoading ?
                        <thead>
                            <tr>
                                {/* <th>#</th> */}
                                <th>campaign Address</th>
                                <th>Token Name</th>
                                <th>Token Address</th>
                                <th>contributed Value</th>
                                <th>campaign status</th>
                            </tr>
                        </thead>
                        : null}
                    {!campaignsLoading && !isEmpty(campaigns)
                        ? Object.values(campaigns).map((campaign: any) => {
                            return <DetailContribution campaign={campaign} />
                        })
                        : null}
                </Table>
            </div >
        </div>
    );
}
export default ContributionDetail;