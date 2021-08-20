import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Campaign, CampaignsState } from '../types'

const initialState: CampaignsState = {
  data: {},
  isLoading: false,
  isLoadingCampaign: false,
  isCreating: false,
  isUpdating: false,
}

export const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    campaignsLoadStart: (state) => {
      return { ...state, isLoading: true }
    },
    campaignsLoadSucceeded: (state, action: PayloadAction<Campaign[]>) => {
      const newData = action.payload?.reduce(
        (prev, camp) => ({
          ...prev,
          [camp.campaignAddress.toLowerCase()]: camp,
          [camp.id]: camp,
        }),
        {},
      )
      return { ...state, isLoading: false, data: { ...state.data, ...newData } }
    },
    campaignsLoadFailed: (state, action: PayloadAction<string>) => {
      return { ...state, isLoading: false, loadingError: action.payload }
    },
    campaignLoadStart: (state) => {
      return { ...state, isLoadingCampaign: true }
    },
    campaignLoadSucceeded: (state, action: PayloadAction<Campaign>) => {
      if (!action.payload) return state
      const data = {
        ...state.data,
        [action.payload.campaignAddress.toLowerCase()]: action.payload,
        [action.payload.id]: action.payload,
      }
      return { ...state, isLoadingCampaign: false, data }
    },
    campaignLoadFailed: (state, action: PayloadAction<string>) => {
      return { ...state, isLoadingCampaign: false, isLoadingCampaignError: action.payload }
    },
    campaignsAdd: (state, action: PayloadAction<Campaign>) => {
      if (!action.payload) return state
      const data = {
        ...state.data,
        [action.payload.campaignAddress.toLowerCase()]: action.payload,
        [action.payload.id]: action.payload,
      }
      return { ...state, isCreating: false, data }
    },
  },
})

// Actions
export const {
  campaignsLoadStart,
  campaignsLoadSucceeded,
  campaignsLoadFailed,
  campaignLoadStart,
  campaignLoadSucceeded,
  campaignLoadFailed,
  campaignsAdd,
} = campaignsSlice.actions

export default campaignsSlice.reducer
