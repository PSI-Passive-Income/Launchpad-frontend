import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Campaign, CampaignsState } from '../types'

const initialState: CampaignsState = {
  data: {},
  dataByAddress: {},
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
      const data = action.payload?.reduce((prev, camp) => ({ ...prev, [camp.id]: camp }), {})
      const dataByAddress = action.payload?.reduce(
        (prev, camp) => ({ ...prev, [camp.campaignAddress.toLowerCase()]: camp }),
        {},
      )
      return {
        ...state,
        isLoading: false,
        data: { ...state.data, ...data },
        dataByAddress: { ...state.dataByAddress, ...dataByAddress },
      }
    },
    campaignsLoadFailed: (state, action: PayloadAction<string>) => {
      return { ...state, isLoading: false, loadingError: action.payload }
    },
    campaignLoadStart: (state) => {
      return { ...state, isLoadingCampaign: true }
    },
    campaignLoadSucceeded: (state, action: PayloadAction<Campaign>) => {
      if (!action.payload) return state
      const data = { ...state.data, [action.payload.id]: action.payload }
      const dataByAddress = { ...state.data, [action.payload.campaignAddress.toLowerCase()]: action.payload }
      return { ...state, isLoadingCampaign: false, data, dataByAddress }
    },
    campaignLoadFailed: (state, action: PayloadAction<string>) => {
      return { ...state, isLoadingCampaign: false, isLoadingCampaignError: action.payload }
    },
    campaignsAdd: (state, action: PayloadAction<Campaign>) => {
      if (!action.payload) return state
      const data = { ...state.data, [action.payload.id]: action.payload }
      const dataByAddress = { ...state.data, [action.payload.campaignAddress.toLowerCase()]: action.payload }
      return { ...state, isCreating: false, data, dataByAddress }
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
