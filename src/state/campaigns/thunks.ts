import { toastError } from 'state/toasts'
import { fetchCampaignsData, fetchCampaignData, getKYCuserVerifcation } from 'utils/apiHelper'
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
import { fetchCampaignsLiveData, fetchDetailedData } from './fetchCampaignsLiveData'

// Thunks
export const getCampaigns = (account?: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(campaignsLoadStart())
    const campaigns: Campaign[] = await fetchCampaignsData()
    await fetchCampaignsLiveData(campaigns, account)
    dispatch(campaignsLoadSucceeded(campaigns))
  } catch (error: any) {
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
      if (!campaign) campaign = await fetchCampaignData(campaignId)
      campaign = await fetchDetailedData(campaign, connectedWallet)
      dispatch(campaignLoadSucceeded(campaign))
    } catch (error: any) {
      dispatch(toastError('Error retrieving campaign', error?.message))
      dispatch(campaignLoadFailed(error?.message))
    }
  }
