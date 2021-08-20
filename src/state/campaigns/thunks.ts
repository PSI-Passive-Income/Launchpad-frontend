import { isEmpty } from 'lodash'
import { toastError } from 'state/toasts'
import { fetchCampaignsData, fetchCampaignData } from 'utils/apiHelper'
import { AppDispatch, RootState } from '../store'
import { Campaign } from '../types'
import {
  campaignsLoadStart,
  campaignsLoadSucceeded,
  campaignsLoadFailed,
  campaignLoadStart,
  campaignLoadSucceeded,
  campaignLoadFailed,
} from '.'
import { fetchCampaignsStatus, fetchCampaignsUserData, fetchDetailedData } from './fetchCampaignsLiveData'

// Thunks
export const getCampaigns = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(campaignsLoadStart())

    const campaigns: Campaign[] = await fetchCampaignsData()
    dispatch(campaignsLoadSucceeded(campaigns))

    await fetchCampaignsStatus(campaigns)
    dispatch(campaignsLoadSucceeded(campaigns))
  } catch (error) {
    dispatch(toastError('Error retrieving campaigns', error?.message))
    dispatch(campaignsLoadFailed(error?.message))
  }
}

export const getCampaign =
  (campaignId: string | number, connectedWallet: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(campaignLoadStart())

      let campaign = getState()?.campaigns?.data[campaignId]
      if (!campaign) {
        campaign = await fetchCampaignData(campaignId)
        dispatch(campaignLoadSucceeded(campaign))
      }

      await fetchDetailedData(campaign, connectedWallet)
      dispatch(campaignLoadSucceeded(campaign))
    } catch (error) {
      dispatch(toastError('Error retrieving campaign', error?.message))
      dispatch(campaignLoadFailed(error?.message))
    }
  }

export const getCampaignsUserData = (address: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const campaigns = getState().campaigns.data
  if (isEmpty(campaigns)) return

  try {
    await fetchCampaignsUserData(Object.values(campaigns), address)
    dispatch(campaignsLoadSucceeded(Object.values(campaigns)))
  } catch (error) {
    dispatch(toastError('Error retrieving live campaigns data', error?.message))
  }
}
