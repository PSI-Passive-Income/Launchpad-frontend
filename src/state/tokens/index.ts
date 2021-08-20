import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Token, TokensState } from '../types'

const initialState: TokensState = {
  data: {},
  userTokens: {},
  isLoading: false,
}

export const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    tokenLoadStart: (state) => {
      return { ...state, isLoading: true }
    },
    tokenLoadSucceeded: (state, action: PayloadAction<Token>) => {
      if (!action.payload) return state
      const data = { ...state.data, [action.payload.address.toLowerCase()]: action.payload }
      return { ...state, isLoading: false, data }
    },
    tokensLoadSucceeded: (state, action: PayloadAction<Token[]>) => {
      if (!action.payload) return state
      return {
        ...state,
        isLoading: false,
        data: action.payload?.reduce((data, val) => ({ ...data, [val.address.toLowerCase()]: val }), state.data),
      }
    },
    tokensUserLoadSucceeded: (state, action: PayloadAction<Token[]>) => {
      if (!action.payload) return state
      return {
        ...state,
        isLoading: false,
        data: action.payload?.reduce((data, val) => ({ ...data, [val.address.toLowerCase()]: val }), state.data),
        userTokens: action.payload?.reduce(
          (data, val) => ({ ...data, [val.address.toLowerCase()]: val }),
          state.userTokens,
        ),
      }
    },
    tokenLoadFailed: (state, action: PayloadAction<string>) => {
      return { ...state, isLoading: false, loadingError: action.payload }
    },
  },
})

// Actions
export const { tokenLoadStart, tokenLoadSucceeded, tokensLoadSucceeded, tokensUserLoadSucceeded, tokenLoadFailed } =
  tokensSlice.actions

export default tokensSlice.reducer
