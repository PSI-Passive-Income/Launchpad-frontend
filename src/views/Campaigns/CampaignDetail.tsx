import React from 'react'
import { useParams } from 'react-router-dom'
import { isFinite, toFinite } from 'lodash'
import { Label } from 'reactstrap'
import { useLoading } from '@agney/react-loading'
import { useCampaign, useToken } from 'state/hooks'
import { formatBN, formatDateTime } from 'utils/formatters'
import { CampaignStatus } from 'state/types'
import Timer from '../../components/Timer'
import Comments from '../../components/UserComments'
import Contribute from './components/Contribute'
import PresaleEnded from './components/PresaleEnded'

interface Params {
  campaignId: string
}

const CampaignDetail: React.FC = () => {
  const { campaignId: tmpCampaignId } = useParams<Params>()
  const campaignId = isFinite(tmpCampaignId) ? toFinite(tmpCampaignId) : tmpCampaignId

  const { campaign, isLoadingCampaign } = useCampaign(campaignId)
  const { token, isLoadingToken } = useToken(campaign?.tokenAddress)

  const { containerProps, indicatorEl } = useLoading({
    loading: !campaign || !token || isLoadingCampaign || isLoadingToken,
  })

  return (
    <div className="content" {...containerProps}>
      <div className="row">
        <div className="col-lg-12">
          {indicatorEl}

          <div className="card">
            <div className="card-header">
              <h5 className="text-center">
                {token.name} ({token.symbol})
              </h5>
            </div>
            <div className="card-body">
              <hr />

              <div className="text-center">
                <Label>Presale Address:</Label>
                <h5>{campaign.campaignAddress}</h5>
              </div>

              <div className="text-center">
                <Label>Token Address:</Label>
                <h5>{campaign.tokenAddress}</h5>
              </div>

              <hr />

              {campaign.status === CampaignStatus.Live ? (
                <>
                  <div className="text-center">
                    <span>
                      {formatBN(campaign.collected)} / {formatBN(campaign.hardCap)} BNB filled
                    </span>
                  </div>
                  <div className="text-center">
                    <span>Min BNB: {formatBN(campaign.minAllowed)}</span>
                    <br />
                    <span>Max BNB: {formatBN(campaign.maxAllowed)}</span>
                  </div>
                </>
              ) : null}

              <div className="col-lg-6 offset-lg-3 text-center">
                {campaign.status === CampaignStatus.NotStarted ? (
                  <div className="presale-end-timer mt-5">
                    <Label>Presale starts in:</Label>
                    {/* <p>06:13:22:34</p> */}
                    <Timer date={campaign.startDate} />
                  </div>
                ) : null}

                {campaign.status === CampaignStatus.Live ? (
                  <>
                    <Contribute campaign={campaign} />

                    <div className="presale-end-timer mt-5">
                      <Label>Presale ends in:</Label>
                      <Timer date={campaign.endDate} />
                    </div>
                  </>
                ) : null}

                {campaign.status === CampaignStatus.Ended || campaign.status === CampaignStatus.Failed ? (
                  <PresaleEnded campaign={campaign} />
                ) : null}

                {campaign.status === CampaignStatus.Live ||
                campaign.status === CampaignStatus.Ended ||
                campaign.status === CampaignStatus.Failed ? (
                  <>
                    <hr />

                    <div>
                      <div className="contribution-box">
                        <Label>Your contributed amount</Label>
                        <h5>{formatBN(campaign.userContributed)} BNB</h5>
                      </div>
                      <div className="contribution-box">
                        <Label>Your tokens:</Label>
                        <h5>
                          {formatBN(campaign.userContributed.multipliedBy(campaign.rate))} {token.symbol}
                        </h5>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-5 col-md-5">
          <div className="card">
            <div className="card-header">
              <h5>Useful Information</h5>
            </div>
            <div className="card-body">
              <div className="col-lg-12">
                <div className="information-bars">
                  <Label>
                    Presale Address:
                    <p>{campaign.campaignAddress}</p>
                  </Label>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="information-bars">
                  <Label>
                    Total Supply:
                    <p>
                      {token.totalSupply.toNumber()} {token.symbol}
                    </p>
                  </Label>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="information-bars">
                  <Label>
                    Soft Cap:
                    <p>{formatBN(campaign.softCap)} BNB</p>
                  </Label>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="information-bars">
                  <Label>
                    Hard Cap:
                    <p>{formatBN(campaign.hardCap)} BNB</p>
                  </Label>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="information-bars">
                  <Label>
                    Liquidity lock duration:
                    <p>{campaign.lockDuration} seconds</p>
                  </Label>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="information-bars">
                  <Label>
                    Minimum Contribution:
                    <p>{formatBN(campaign.minAllowed)} BNB</p>
                  </Label>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="information-bars">
                  <Label>
                    Maximum Contribution:
                    <p>{formatBN(campaign.maxAllowed)} BNB</p>
                  </Label>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="information-bars">
                  <Label>
                    Campaign Start Time:
                    <p>{formatDateTime(campaign.startDate)}</p>
                  </Label>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="information-bars">
                  <Label>
                    Campaign End Time:
                    <p>{formatDateTime(campaign.endDate)}</p>
                  </Label>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="information-bars">
                  <Label>
                    PancakeSwap Liquidity %:
                    <p>{campaign.liquidityRate / 100} %</p>
                  </Label>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="information-bars">
                  <Label>
                    PancakeSwap Listing Rate:
                    <p>
                      {formatBN(campaign.rate)} {token.symbol} per BNB
                    </p>
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-7 col-md-7">
          <Comments topicId={campaign.tokenAddress} />
        </div>
      </div>
    </div>
  )
}
export default CampaignDetail
