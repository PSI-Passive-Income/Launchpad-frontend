import React from 'react'
import { Campaign, CampaignStatus } from 'state/types'
import { formatBN, formatDateTime, formatDuration } from 'utils/formatters'
import useUserVerification from 'hooks/useUserKYC'
import { useToken } from 'state/hooks'
import { isEmpty } from 'lodash'
import Timer from '../../components/Timer'
import project from '../../assets/img/icons/project-default1.jpeg'
import bannerGreen from '../../assets/img/icons/Banner_KYC_Yes_Green.svg'
import bannerRed from '../../assets/img/icons/Banner_KYC_No_Red.svg'


interface Props {
  campaign: Campaign
}

const CampaignSmallCard: React.FC<Props> = ({ campaign }) => {

  const { token, isLoadingToken } = useToken(campaign?.tokenAddress)
  console.log(token)

  const { KYCaddress, verified } = useUserVerification();
  KYCaddress(campaign.owner)

  return (

    <div className="col-md-4">
      <a href={`/project/${campaign.campaignAddress}`}>
        {
          !isLoadingToken && !isEmpty(token) ?
            <div className="card card-user">
              <div className="card-body">
                {campaign.status === CampaignStatus.Live ? (
                  <span className="badge project-status badge-primary">
                    <b>Live</b>
                  </span>
                ) : null}
                {campaign.status === CampaignStatus.Ended ? (
                  <span className="badge project-status badge-success">
                    <b>Ended</b>
                  </span>
                ) : null}
                {campaign.status === CampaignStatus.Failed ? (
                  <span className="badge project-status badge-danger ">
                    <b>Failed</b>
                  </span>
                ) : null}
                {!campaign.status || campaign.status === CampaignStatus.NotStarted ? (
                  <span className="badge project-status badge-info ">
                    <b>Coming soon</b>
                  </span>
                ) : null}
                {verified ? (<img src={bannerGreen} alt="..." className="banner-kyc z-index-999" />)
                  : (<img src={bannerRed} alt="..." className="banner-kyc z-index-999" />)
                }

                <p className="card-text" />

                <div className="author project text-white position-relative">
                  <div className="block block-one" />
                  <div className="block block-two" />
                  <div className="block block-three" />
                  <div className="block block-four" />
                  <div>
                    <img src={project} alt="..." className="avatar" />
                    <h3 className="title">{token.name}</h3>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <h6>Campaign Address:</h6>
                      <a
                        href={`https://testnet.bscscan.com/address/${campaign.campaignAddress}`}
                        target="_blank"
                        rel="noreferrer"
                        className="small"
                      >
                        {campaign.campaignAddress}
                      </a>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-12">
                      <h6>Token Address:</h6>
                      <a
                        href={`https://testnet.bscscan.com/token/${campaign.campaignAddress}`}
                        target="_blank"
                        rel="noreferrer"
                        className="small"
                      >
                        {campaign.tokenAddress}
                      </a>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-12">Starts: {formatDateTime(campaign.startDate)}</div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">Ends: {formatDateTime(campaign.endDate)}</div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-12">
                      Soft Cap: {formatBN(campaign.softCap)} {campaign.tokenName}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      Hard Cap: {formatBN(campaign.hardCap)} {campaign.tokenName}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">Liquidity Lock: {formatDuration(campaign.lockDuration, true)}</div>
                  </div>
                  <br />
                  {campaign.status === CampaignStatus.NotStarted && (
                    <div>
                      <Timer date={campaign.startDate} />
                    </div>
                  )}

                  {campaign.status === CampaignStatus.Live && (
                    <div>
                      <Timer date={campaign.endDate} />
                    </div>
                  )}
                  {/* <div className="progress mt-2 fixed-bottom position-absolute" >
                  <div role="progressbar" aria-valuemin="0" aria-valuemax="50" aria-valuenow="0" className="progress-bar bg-success width-112" ><span>
                    <strong>59</strong>
                  </span></div>
                  <div role="progressbar" aria-valuemin="0" aria-valuemax="50" aria-valuenow="0" className="progress-bar bg-warning width-112" ><span><strong>0</strong></span>
                  </div>
                </div> */}
                </div>
              </div>
            </div> : null
        }
      </a>
    </div>
  )
}
export default CampaignSmallCard
