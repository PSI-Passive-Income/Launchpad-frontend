import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { getCampaign } from 'state/actions'
import { handleTransactionCall, lockCampaign, unlockCampaign } from 'utils/callHelpers'
import { useCampaignFactory } from './useContract'
import { useActiveWeb3React } from './web3'

export const useLock = (campaignId: number) => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const campaignFactory = useCampaignFactory()

  return useCallback(async () => {
    if (campaignFactory && account) {
      const success = await handleTransactionCall(() => lockCampaign(campaignFactory, account, campaignId), dispatch)
      if (success) dispatch(getCampaign(campaignId, account))
    }
  }, [dispatch, account, campaignId, campaignFactory])
}

export const useUnlock = (campaignId: number) => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const campaignFactory = useCampaignFactory()

  return useCallback(async () => {
    if (campaignFactory && account && campaignId) {
      const success = await handleTransactionCall(() => unlockCampaign(campaignFactory, account, campaignId), dispatch)
      if (success) dispatch(getCampaign(campaignId, account))
    }
  }, [dispatch, account, campaignId, campaignFactory])
}
