import React from 'react'
import { Campaign, CampaignStatus } from 'state/types'
import Timer from '../../components/Timer'
import project from '../../assets/img/icons/project-default.jpg'
import bannerGreen from '../../assets/img/icons/Banner KYC No Green.svg'
import bannerNo from '../../assets/img/icons/Banner KYC Yes Green.svg'

interface Props {
  campaign: Campaign
}

const CampaignSmallCard: React.FC<Props> = ({ campaign }) => {
  return (
    <div className="col-md-4">
      {
        // arry.map((stat) => {
        //   if (!props.status) return;
        //   console.log('status', stat);
        // console.log("afasdf"),

        <a href={`/campaign-detail/${campaign.campaignAddress}`}>
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

              <img src={bannerGreen} alt="..." className="banner-kyc z-index-999" />
              <img src={bannerNo} alt="..." className="banner-audit z-index-999" />

              <p className="card-text" />

              <div className="author project text-white position-relative">
                <div className="block block-one" />
                <div className="block block-two" />
                <div className="block block-three" />
                <div className="block block-four" />
                <div>
                  <img src={project} alt="..." className="avatar" />
                  <h3 className="title">{campaign.tokenName}</h3>
                </div>
                <div>
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

                <div>
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
                <br />
                <div className="row">
                  <div className="col-md-6">Starts: {campaign.startDate}</div>
                  <div className="col-md-6">Ends: {campaign.endDate}</div>
                </div>
                <br />
                <div className="row">
                  <div className="col-md-6">
                    Soft Cap: {campaign.softCap} {campaign.tokenName}
                  </div>
                  <div className="col-md-6">
                    Hard Cap: {campaign.hardCap} {campaign.tokenName}
                  </div>
                </div>
                <div>Liquidity Lock: {campaign.lockDuration}</div>
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
          </div>
        </a>

        //  })
      }
      {/* console.log('filter', filter); */}
    </div>
  )
}
export default CampaignSmallCard