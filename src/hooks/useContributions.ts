import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { BigNumberish } from '@ethersproject/bignumber'
import { getCampaign } from 'state/actions'
import { buyTokens, withdrawTokens, withdrawFunds, handleTransactionCall } from 'utils/callHelpers'
import { useCampaign } from './useContract'
import { useActiveWeb3React } from './web3'

export const useBuyTokens = (campaignAddress: string) => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const campaign = useCampaign(campaignAddress)

  return useCallback(
    async (amount: BigNumberish) => {
      if (account && campaign) {
        const success = await handleTransactionCall(() => buyTokens(campaign, account, amount), dispatch)
        if (success) dispatch(getCampaign(campaignAddress, account))
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
      const success = await handleTransactionCall(() => withdrawTokens(campaign, account), dispatch)
      if (success) dispatch(getCampaign(campaignAddress, account))
    }
  }, [dispatch, account, campaign, campaignAddress])
}

export const useWithdrawFunds = (campaignAddress: string) => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const campaign = useCampaign(campaignAddress)

  return useCallback(async () => {
    if (account && campaign) {
      const success = await handleTransactionCall(() => withdrawFunds(campaign, account), dispatch)
      if (success) dispatch(getCampaign(campaignAddress, account))
    }
  }, [dispatch, account, campaign, campaignAddress])
}
