import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User, UserState } from '../types'

const initialState: UserState = {
  isLoggedIn: false,
  data: null,
  username: null,
  accessToken: null,

  isLoggingIn: false,
  loginError: null,
  isUpdating: false,
  updateError: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoginStart: (state) => {
      return { ...state, isLoggingIn: true }
    },
    userLoginSucceeded: (state, action: PayloadAction<{ username: string; accessToken: string }>) => {
      const { username, accessToken } = action.payload

      return {
        ...state,
        isLoggedIn: true,
        isLoggingIn: false,
        data: state.data,
        username,
        accessToken,
      }
    },
    userLoginFailed: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: false,
        loginError: action.payload,
      }
    },
    userLogout: () => {
      return initialState
    },
    userUpdateStart: (state) => {
      return { ...state, isUpdating: true }
    },
    userUpdateSucceeded: (state, action: PayloadAction<User>) => {
      return {
        ...state,
        isUpdating: false,
        data: action.payload,
        username: action.payload?.username,
      }
    },
    userUpdateFailed: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        isUpdating: false,
        loginError: action.payload,
      }
    },
  },
})

// Actions
export const {
  userLoginStart,
  userLoginSucceeded,
  userLoginFailed,
  userLogout,
  userUpdateStart,
  userUpdateSucceeded,
  userUpdateFailed,
} = userSlice.actions

export default userSlice.reducer
