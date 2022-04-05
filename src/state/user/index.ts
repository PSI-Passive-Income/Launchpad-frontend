import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User, UserState } from '../types'

const initialState: UserState = {
  isLoggedIn: false,
  data: null,
  accessToken: null,
  isLoading: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoginStart: (state) => {
      return { ...state, isLoading: true }
    },
    userLoginSucceeded: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
      const { user, accessToken } = action.payload

      return {
        ...state,
        isLoggedIn: true,
        isLoading: false,
        data: user,
        accessToken,
      }
    },
    userLoginFailed: (state) => {
      return { ...state, isLoading: false, isLoggedIn: false }
    },
    userUnload: () => {
      return initialState
    },
    userLoadStart: (state) => {
      return { ...state, isLoading: true }
    },
    userLoadSucceeded: (state, action: PayloadAction<User>) => {
      return {
        ...state,
        isLoading: false,
        data: action.payload,
        username: action.payload?.username,
      }
    },
    userLoadFailed: (state) => {
      return { ...state, isLoading: false }
    },
  },
})

// Actions
export const {
  userLoginStart,
  userLoginSucceeded,
  userLoginFailed,
  userUnload,
  userLoadStart,
  userLoadSucceeded,
  userLoadFailed,
} = userSlice.actions

export default userSlice.reducer
