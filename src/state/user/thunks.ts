import { Web3Provider } from '@ethersproject/providers'
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
  (library: Web3Provider, address: string, onlySilent = false) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    if (getState().user.isLoggingIn) return

    const tokenInfo = sessionStorage.getItem('MM_TokenInfo')
    let { username, accessToken } = tokenInfo ? JSON.parse(tokenInfo) : { username: null, accessToken: null }
    if (accessToken) dispatch(userLoginSucceeded({ username, accessToken }))
    if (accessToken || onlySilent) return

    try {
      dispatch(userLoginStart())

      const nonce = await getUserNonce(address)
      const signature = await userSignMessage(library, address, nonce)
      ;({ username, accessToken } = await userAuthenticate(address, signature))
      sessionStorage.setItem('MM_TokenInfo', JSON.stringify({ username, accessToken }))

      dispatch(userLoginSucceeded({ username, accessToken }))
    } catch (error: any) {
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
  } catch (error: any) {
    dispatch(toastError('Error updating user', error?.message))
    dispatch(userUpdateFailed(error?.message))
  }
}
