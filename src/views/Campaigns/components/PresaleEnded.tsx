import React from 'react'
import { Campaign, CampaignStatus } from 'state/types'
import { useWithdrawFunds, useWithdrawTokens } from 'hooks/useContributions'
import { useLock, useUnlock } from 'hooks/useCampaignLocks'
import { useActiveWeb3React } from 'hooks/web3'

interface Props {
  campaign: Campaign
}

const PresaleEnded: React.FC<Props> = ({ campaign }) => {
  const { account } = useActiveWeb3React()

  const lock = useLock(campaign?.id)
  const lockClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    lock()
  }

  const unlock = useUnlock(campaign?.id)
  const unlockClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    unlock()
  }

  const withdrawTokens = useWithdrawTokens(campaign?.campaignAddress)
  const withdrawTokensClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    withdrawTokens()
  }

  const withdrawFunds = useWithdrawFunds(campaign?.campaignAddress)
  const withdrawFundsClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    withdrawFunds()
  }

  return (
    <>
      <div className="presale-ended-timer mt-2">
        <h5>Presale has ended. Kindly find others on our dashboard</h5>

        {campaign.locked && campaign.status === CampaignStatus.Ended ? (
          <button type="button" className="btn btn-danger mb-4">
            Trade On PSI Dex
          </button>
        ) : null}

        {campaign.userContributed.gt(0) && campaign.locked && campaign.status === CampaignStatus.Ended ? (
          <>
            <p>
              Congratulations! Please click the claim button below to claim your tokens!
            </p>
            <button type="button" onClick={withdrawTokensClick} className="btn btn-primary">
              Claim Tokens
            </button>
          </>
        ) : null}

        {campaign.userContributed.gt(0) && campaign.status === CampaignStatus.Failed ? (
          <>
            <p>
              Too bad, this presale has failed. Please click the claim button below to withdraw you contribution.
            </p>
            <button type="button" onClick={withdrawFundsClick} className="btn btn-primary">
              Withdraw contribution
            </button>
          </>
        ) : null}
      </div>

      {account && campaign.owner === account && !campaign.locked && campaign.status === CampaignStatus.Ended ? (
        <div>
          <button type="button" onClick={lockClick} className="btn btn-primary">
          Finish presale and lock liquidity tokens
          </button>
        </div>
      ) : null}

      {account && campaign.owner === account && campaign.locked && Date.now() >= campaign.unlockDate.getTime() ? (
        <div>
          <button type="button" onClick={unlockClick} className="btn btn-primary">
            Unlock liquidity tokens
          </button>
        </div>
      ) : null}
    </>
  )
}

export default PresaleEnded
