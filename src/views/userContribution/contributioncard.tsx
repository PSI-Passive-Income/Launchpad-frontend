import React from 'react'
import { useCampaigns, useLoggedInUser } from 'state/hooks'
import Loader from 'components/Loader'
import { isEmpty } from 'lodash'
import { Label, Table } from 'reactstrap'
import DetailContribution from './contributionDetail'




const ContributionDetail: React.FC = () => {

    const { campaigns, campaignsLoading } = useCampaigns()
    const { isLoggedIn, accessToken } = useLoggedInUser()
    console.log(accessToken, isLoggedIn)

    return (
        <div className="content">
            <div className="card">
                <Loader loading={campaignsLoading} />
                {isLoggedIn && accessToken ?
                    <Table dark>
                        {!campaignsLoading ?
                            <thead>
                                <tr>
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
                            : null
                        }
                    </Table>
                    : <h3 className="KYC-box text-center">Please connect wallet</h3>
                }
            </div >

        </div>
    );
}
export default ContributionDetail;