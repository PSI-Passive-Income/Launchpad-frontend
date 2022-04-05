import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { getCampaign } from 'state/actions'
import { lockCampaign, unlockCampaign } from 'utils/callHelpers'
import { useCampaignFactory } from './useContract'
import { useActiveWeb3React } from './web3'

export const useLock = (campaignId: number) => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const campaignFactory = useCampaignFactory()

  return useCallback(async () => {
    if (campaignFactory && account) {
      const receipt = await lockCampaign(campaignFactory, account, campaignId)
      dispatch(getCampaign(campaignId, account))
      console.info(receipt)
    }
  }, [dispatch, account, campaignId, campaignFactory])
}

export const useUnlock = (campaignId: number) => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const campaignFactory = useCampaignFactory()

  return useCallback(async () => {
    if (campaignFactory && account && campaignId) {
      const receipt = await unlockCampaign(campaignFactory, account, campaignId)
      dispatch(getCampaign(campaignId, account))
      console.info(receipt)
    }
  }, [dispatch, account, campaignId, campaignFactory])
}
