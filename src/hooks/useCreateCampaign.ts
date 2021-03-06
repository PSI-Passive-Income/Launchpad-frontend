import { BigNumber } from '@ethersproject/bignumber'
import { isNumber } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { campaignsAdd, toastError } from 'state/actions'
import { useLoggedInUser } from 'state/hooks'
import { Campaign } from 'state/types'
import { addCampaign, getKYCuserVerifcation } from 'utils/apiHelper'
import {
  tokensNeeded,
  createCampaign,
  getUserCampaigns,
  getCampaignAddress,
  handleTransactionCall,
} from 'utils/callHelpers'
import useApproval from './useApproval'
import { useCampaignFactory } from './useContract'
import { useActiveWeb3React } from './web3'

export const useTokensNeeded = (campaign: Partial<Campaign>) => {
  const campaignFactory = useCampaignFactory()
  const [needed, setNeeded] = useState(BigNumber.from(0))

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
  return useApproval(tokenAddress, campaignFactory?.address)
}

export const useCreateCampaign = () => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const { accessToken } = useLoggedInUser()
  const campaignFactory = useCampaignFactory()
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)

  const handleCreateCampaign = useCallback(
    async (campaign: Partial<Campaign>) => {
      if (account && campaign && navigate) {
        try {
          setCreating(true)
          const success = await handleTransactionCall(
            () => createCampaign(campaignFactory, account, campaign),
            dispatch,
          )
          if (success) {
            const userCampaigns = await getUserCampaigns(campaignFactory, account)
            if (userCampaigns.length > 0) {
              const campaignId = userCampaigns[userCampaigns.length - 1]
              const campaignAddress = await getCampaignAddress(campaignFactory, campaignId)
              const kycVerified = await getKYCuserVerifcation(account)
              if (isNumber(campaignId) && campaignAddress) {
                const addedCampaign = await addCampaign(accessToken, {
                  ...campaign,
                  id: campaignId,
                  owner: account,
                  campaignAddress,
                  kycVerified,
                })
                dispatch(campaignsAdd(addedCampaign))
                navigate(`/project/${addedCampaign.campaignAddress}`)
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
          console.error(error)
          dispatch(toastError('Error adding campaign', error?.message))
        } finally {
          setCreating(false)
        }
      }
    },
    [dispatch, account, accessToken, campaignFactory, navigate],
  )

  return { createCampaign: handleCreateCampaign, creatingCampaign: creating }
}
