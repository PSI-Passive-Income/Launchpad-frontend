import BigNumber from 'bignumber.js'
import { isNumber } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { campaignsAdd, toastError } from 'state/actions'
import { useLoggedInUser } from 'state/hooks'
import { Campaign } from 'state/types'
import { addCampaign } from 'utils/apiHelper'
import { tokensNeeded, createCampaign, getUserCampaigns, getCampaignAddress } from 'utils/callHelpers'
import useApproval from './useApproval'
import { useCampaignFactory } from './useContract'
import { useActiveWeb3React } from './web3'

export const useTokensNeeded = (campaign: Partial<Campaign>) => {
  const campaignFactory = useCampaignFactory()
  const [needed, setNeeded] = useState(new BigNumber(0))

  useEffect(() => {
    const getTokensNeeded = async () => {
      if (campaign.hardCap && campaign.rate && campaign.poolRate && campaign.liquidityRate) {
        const _needed = await tokensNeeded(campaignFactory, campaign)
        setNeeded(_needed)
      }
    }
    getTokensNeeded()
  }, [campaignFactory, campaign])

  return needed
}

export const useCampaignFactoryApproval = (tokenAddress: string) => {
  const campaignFactory = useCampaignFactory()
  return useApproval(tokenAddress, campaignFactory?.options?.address)
}

export const useCreateCampaign = () => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const { accessToken } = useLoggedInUser()
  const campaignFactory = useCampaignFactory()
  const history = useHistory()
  const [creating, setCreating] = useState(false)


  const handleCreateCampaign = useCallback(
    async (campaign: Partial<Campaign>) => {
      if (account && campaign && history) {
        try {
          setCreating(true)
          const receipt = await createCampaign(campaignFactory, account, campaign)
          console.info(receipt)
          if (receipt.status) {
            const userCampaigns = await getUserCampaigns(campaignFactory, account)
            console.log("userCampaigns", userCampaigns)
            if (userCampaigns.length > 0) {
              const campaignId = userCampaigns[userCampaigns.length - 1]
              const campaignAddress = await getCampaignAddress(campaignFactory, campaignId);
              console.log("campaignAddress", campaignAddress)
              if (isNumber(campaignId) && campaignAddress) {
                const addedCampaign = await addCampaign(accessToken, { ...campaign, id: campaignId, owner: account, campaignAddress })
                dispatch(campaignsAdd(addedCampaign))
                history.push(`/project/${addedCampaign.campaignAddress}`)
              } else {
                dispatch(toastError('Error adding campaign', 'Campaign not added correctly'))
              }
            } else {
              dispatch(toastError('Error adding campaign', 'Campaign is not found on the contract'))
            }
          } else {
            dispatch(toastError('Error adding campaign', 'Transaction failed'))
          }
        } catch (error: any) {
          console.log("error", error)
          dispatch(toastError('Error adding campaign', error?.message))
        } finally {
          setCreating(false)
        }
      }
    },
    [dispatch, account, accessToken, campaignFactory, history],
  )

  return { createCampaign: handleCreateCampaign, creatingCampaign: creating }
}
