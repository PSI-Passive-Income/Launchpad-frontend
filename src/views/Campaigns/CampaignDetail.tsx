import React from 'react'
import { useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'
import { Form } from 'react-bootstrap'
import { useCampaign, useToken } from 'state/hooks'
import { formatBN, formatDateTime, formatDuration } from 'utils/formatters'
import { CampaignStatus } from 'state/types'
import { useGlobalLoader } from 'components/Loader'
import { useActiveWeb3React } from 'hooks/web3'
import { parseEther } from '@ethersproject/units'
import Timer from '../../components/Timer'
import Contribute from './components/Contribute'
import PresaleEnded from './components/PresaleEnded'
import WhitelistAdd from './components/WhitelistAdd'

interface Params {
  [key: string]: string
  campaignId: string
}

const CampaignDetail: React.FC = () => {
  const { campaignId: tmpCampaignId } = useParams<Params>()
  const campaignId = tmpCampaignId.startsWith('0x') ? tmpCampaignId : parseInt(tmpCampaignId)

  const { account } = useActiveWeb3React()
  const { campaign, isLoadingCampaign } = useCampaign(campaignId)
  const { token, isLoadingToken } = useToken(campaign?.tokenAddress)

  const isOwner = account && campaign?.owner && campaign.owner.toLowerCase() === account.toLowerCase()
  const loading = !campaign || !token || isLoadingCampaign || isLoadingToken

  useGlobalLoader(loading)

  return (
    <div className="content">
      {!isEmpty(token) && !isEmpty(campaign) ? (
        <div className="row">
          <div className="col-lg-7">
            <div className="card">
              <div className="card-header">
                <h4 className="text-center">
                  {token.name} ({token.symbol})
                </h4>
              </div>
              <div className="card-body pt-0">
                <hr />
                <div className="text-center">
                  <Form.Label>Presale Address:</Form.Label>
                  <h5>{campaign.campaignAddress}</h5>
                </div>

                <div className="text-center">
                  <Form.Label>Token Address:</Form.Label>
                  <h5>{campaign.tokenAddress}</h5>
                </div>
                {campaign?.whitelistEnabled ? (
                  <div className="text-center">
                    <Form.Label>Whitelist status:</Form.Label>
                    <h5>
                      {campaign.userWhitelisted ? (
                        <span className="text-success">Whitelisted</span>
                      ) : (
                        <span className="text-danger">Not whitelisted</span>
                      )}
                    </h5>
                  </div>
                ) : null}
                <hr />

                {campaign.status === CampaignStatus.Live || campaign.status === CampaignStatus.Failed ? (
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
                    <hr />
                  </>
                ) : null}

                <div className="text-center">
                  {campaign.status === CampaignStatus.NotStarted ? (
                    <div className="presale-end-timer mt-2">
                      <Form.Label>Presale starts in:</Form.Label>
                      {/* <p>06:13:22:34</p> */}
                      <Timer date={campaign.startDate} />
                    </div>
                  ) : null}
                  {campaign.status === CampaignStatus.Live ? (
                    <>
                      {!campaign?.whitelistEnabled || campaign.userWhitelisted ? (
                        <Contribute campaign={campaign} token={token} />
                      ) : null}
                      <div className="presale-end-timer mt-2">
                        <Form.Label>Presale ends in:</Form.Label>
                        <Timer date={campaign.endDate} />
                      </div>
                    </>
                  ) : null}
                  {campaign.status === CampaignStatus.Ended || campaign.status === CampaignStatus.Failed ? (
                    <PresaleEnded campaign={campaign} token={token} />
                  ) : null}
                  {campaign.status === CampaignStatus.Live ||
                  campaign.status === CampaignStatus.Ended ||
                  campaign.status === CampaignStatus.Failed ? (
                    <>
                      <hr />
                      <div>
                        <div className="col-lg-6 offset-lg-3 text-center contribution-box">
                          <Form.Label>Your contributed amount</Form.Label>
                          <h5>{formatBN(campaign?.userContributed)} BNB</h5>
                        </div>
                        {campaign.status !== CampaignStatus.Failed ? (
                          <div className="col-lg-6 offset-lg-3 text-center contribution-box">
                            <Form.Label>Your tokens:</Form.Label>
                            <h5>
                              {formatBN(campaign?.userContributed?.mul(campaign.rate).div(parseEther('1')))}{' '}
                              {token.symbol}
                            </h5>
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                </div>

                {isOwner &&
                (campaign.status === CampaignStatus.NotStarted || campaign.status === CampaignStatus.Live) ? (
                  <>
                    <hr />
                    <WhitelistAdd campaign={campaign} />
                  </>
                ) : null}
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">{/* <Comments topicId={campaign.tokenAddress} /> */}</div>
            </div>
          </div>
          <div className="col-lg-5 col-md-5">
            {/* <UploadFile campaign={campaign}/> */}
            <div className="card">
              <div className="card-header">
                <h5>Useful Information</h5>
              </div>
              <div className="card-body">
                <div className="col-lg-12">
                  <div className="information-bars">
                    <Form.Label>
                      Presale Address:
                      <p>{campaign.campaignAddress}</p>
                    </Form.Label>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="information-bars">
                    <Form.Label>
                      Total Supply:
                      <p>
                        {formatBN(token.totalSupply, token.decimals)} {token.symbol}
                      </p>
                    </Form.Label>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="information-bars">
                    <Form.Label>
                      Soft Cap:
                      <p>{formatBN(campaign.softCap)} BNB</p>
                    </Form.Label>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="information-bars">
                    <Form.Label>
                      Hard Cap:
                      <p>{formatBN(campaign.hardCap)} BNB</p>
                    </Form.Label>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="information-bars">
                    <Form.Label>
                      Liquidity lock duration:
                      <p>{formatDuration(campaign.lockDuration, true)}</p>
                    </Form.Label>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="information-bars">
                    <Form.Label>
                      Minimum Contribution:
                      <p>{formatBN(campaign.minAllowed)} BNB</p>
                    </Form.Label>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="information-bars">
                    <Form.Label>
                      Maximum Contribution:
                      <p>{formatBN(campaign.maxAllowed)} BNB</p>
                    </Form.Label>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="information-bars">
                    <Form.Label>
                      Tokens rate:
                      <p>
                        {formatBN(campaign.rate, token.decimals)} {token.symbol} per BNB
                      </p>
                    </Form.Label>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="information-bars">
                    <Form.Label>
                      Campaign Start Time:
                      <p>{formatDateTime(campaign.startDate)}</p>
                    </Form.Label>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="information-bars">
                    <Form.Label>
                      Campaign End Time:
                      <p>{formatDateTime(campaign.endDate)}</p>
                    </Form.Label>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="information-bars">
                    <Form.Label>
                      PSI Dex Liquidity %:
                      <p>{campaign.liquidityRate / 100} %</p>
                    </Form.Label>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="information-bars">
                    <Form.Label>
                      PSI Dex Listing Rate:
                      <p>
                        {formatBN(campaign.poolRate, token.decimals)} {token.symbol} per BNB
                      </p>
                    </Form.Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
export default CampaignDetail
