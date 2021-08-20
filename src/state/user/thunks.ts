import Web3 from 'web3'
import { toastError } from 'state/toasts'
import { AppDispatch, RootState } from '../store'
import { User } from '../types'
import userAuthenticate from './userAuthenticate'
import userSignMessage from './userSignMessage'
import userUpdate from './userUpdate'
import {
  userLoginStart,
  userLoginSucceeded,
  userLoginFailed,
  userLogout,
  userUpdateStart,
  userUpdateSucceeded,
  userUpdateFailed,
} from '.'
import getUserNonce from './getUserNonce'

// Thunks
export const loginWallet =
  (web3: Web3, address: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    if (getState().user.isLoggingIn) return

    try {
      dispatch(userLoginStart())

      const tokenInfo = sessionStorage.getItem('MM_TokenInfo')
      let { username, accessToken } = tokenInfo ? JSON.parse(tokenInfo) : { username: null, accessToken: null }

      if (!accessToken) {
        const nonce = await getUserNonce(address)
        const signature = await userSignMessage(web3, address, nonce)
        ;({ username, accessToken } = await userAuthenticate(address, signature))
        sessionStorage.setItem('MM_TokenInfo', JSON.stringify({ username, accessToken }))
      }

      dispatch(userLoginSucceeded({ username, accessToken }))
    } catch (error) {
      dispatch(toastError('Error logging in', error?.message))
      dispatch(userLoginFailed(error?.message))
    }
  }

export const logoutWallet = () => {
  sessionStorage.removeItem('MM_TokenInfo')
  return userLogout()
}

export const updateUser = (user: Partial<User>) => async (dispatch: AppDispatch, getState: () => RootState) => {
  if (getState().user.isLoggingIn || !getState().user.accessToken) return

  try {
    dispatch(userUpdateStart())

    const finalUser = { ...getState().user.data, ...user }
    const userReturned = await userUpdate(getState().user.accessToken, finalUser)
    sessionStorage.setItem(
      'MM_TokenInfo',
      JSON.stringify({ username: userReturned.username, accessToken: getState().user.accessToken }),
    )

    dispatch(userUpdateSucceeded(userReturned))
  } catch (error) {
    dispatch(toastError('Error updating user', error?.message))
    dispatch(userUpdateFailed(error?.message))
  }
}
