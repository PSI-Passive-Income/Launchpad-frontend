import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { BigNumberish } from '@ethersproject/bignumber'
import { getCampaign } from 'state/actions'
import { buyTokens, withdrawTokens, withdrawFunds } from 'utils/callHelpers'
import { useCampaign } from './useContract'
import { useActiveWeb3React } from './web3'

export const useBuyTokens = (campaignAddress: string) => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const campaign = useCampaign(campaignAddress)

  return useCallback(
    async (amount: BigNumberish) => {
      if (account && campaign) {
        const receipt = await buyTokens(campaign, account, amount)
        dispatch(getCampaign(campaignAddress, account))
        console.info(receipt)
      }
    },
    [dispatch, account, campaign, campaignAddress],
  )
}

export const useWithdrawTokens = (campaignAddress: string) => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const campaign = useCampaign(campaignAddress)

  return useCallback(async () => {
    if (account && campaign) {
      const receipt = await withdrawTokens(campaign, account)
      dispatch(getCampaign(campaignAddress, account))
      console.info(receipt)
    }
  }, [dispatch, account, campaign, campaignAddress])
}

export const useWithdrawFunds = (campaignAddress: string) => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const campaign = useCampaign(campaignAddress)

  return useCallback(async () => {
    if (account && campaign) {
      const receipt = await withdrawFunds(campaign, account)
      dispatch(getCampaign(campaignAddress, account))
      console.info(receipt)
    }
  }, [dispatch, account, campaign, campaignAddress])
}
