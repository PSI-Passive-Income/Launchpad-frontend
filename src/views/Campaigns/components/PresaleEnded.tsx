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

  const isOwner = account && campaign.owner && campaign.owner.toLowerCase() === account.toLowerCase()

  return (
    <>
      <div className="presale-ended-timer mt-2">
        {campaign.status === CampaignStatus.Ended ? (
          <>
            <h5>Presale has ended. Check out our other projects!</h5>

            {campaign.locked ? (
              <button type="button" className="btn btn-danger mb-4">
                Trade On PSI Dex
              </button>
            ) : null}
          </>
        ) : null}

        {campaign.status === CampaignStatus.Failed ? <h5>Too bad, this presale has failed.</h5> : null}

        {campaign.userContributed.gt(0) && campaign.locked && campaign.status === CampaignStatus.Ended ? (
          <>
            <p>Congratulations! Please click the claim button below to claim your tokens!</p>
            <button type="button" onClick={withdrawTokensClick} className="btn btn-primary">
              Claim Tokens
            </button>
          </>
        ) : null}

        {campaign.userContributed.gt(0) && campaign.status === CampaignStatus.Failed ? (
          <>
            <p>Please click the button below to withdraw you contribution.</p>
            <button type="button" onClick={withdrawFundsClick} className="btn btn-primary">
              Withdraw contribution
            </button>
          </>
        ) : null}

        {isOwner && campaign.status === CampaignStatus.Failed ? (
          <>
            <p>Please click the button below to withdraw the token sale tokens.</p>
            <button type="button" onClick={withdrawFundsClick} className="btn btn-primary">
              Withdraw sale tokens
            </button>
          </>
        ) : null}
      </div>

      {isOwner && !campaign.locked && campaign.status === CampaignStatus.Ended ? (
        <div>
          <button type="button" onClick={lockClick} className="btn btn-primary">
            Finish presale and lock liquidity tokens
          </button>
        </div>
      ) : null}

      {isOwner && campaign.locked && Date.now() >= campaign.unlockDate.getTime() ? (
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
