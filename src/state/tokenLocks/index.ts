import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TokenLock, TokenLocksState } from '../types'

const initialState: TokenLocksState = {
  data: {},
  userLocks: {},
  tokenLocks: {},
  isLoading: false,
}

export const tokensSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    locksLoadStart: (state) => {
      return { ...state, isLoading: true }
    },
    locksLoadSucceeded: (state, action: PayloadAction<TokenLock[]>) => {
      return {
        ...state,
        isLoading: false,
        data: action.payload?.reduce((obj, val) => ({ ...obj, [val.id]: val }), state.data),
        userLocks: action.payload?.reduce(
          (locks, val) => ({ ...locks, [val.owner]: { ...locks[val.owner], [val.id]: val } }),
          state.userLocks,
        ),
        tokenLocks: action.payload?.reduce(
          (locks, val) => ({ ...locks, [val.token]: { ...locks[val.token], [val.id]: val } }),
          state.tokenLocks,
        ),
      }
    },
    locksLoadFailed: (state, action: PayloadAction<string>) => {
      return { ...state, isLoading: false, loadingError: action.payload }
    },
  },
})

// Actions
export const { locksLoadStart, locksLoadSucceeded, locksLoadFailed } = tokensSlice.actions

export default tokensSlice.reducer
