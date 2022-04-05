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
  userUnload,
  userLoadStart,
  userLoadSucceeded,
  userLoadFailed,
} from '.'
import getUserNonce from './getUserNonce'
import { getLoggedInUser } from './getUser'

const storage = localStorage // sessionStorage

interface TokenInfo {
  user: User
  accessToken: string
}

// Thunks
export const loginWallet =
  (library: Web3Provider, account: string, onlySilent = false) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    if (!account || getState().user.isLoading) return

    const tokenInfo = storage.getItem(`MM_TokenInfo_${account.toLowerCase()}`)
    let { user, accessToken }: TokenInfo = tokenInfo ? JSON.parse(tokenInfo) : {}
    if (user && accessToken && user?.publicAddress?.toLowerCase() === account?.toLowerCase()) {
      dispatch(userLoginSucceeded({ user, accessToken }))
      return
    }
    if (onlySilent) return

    try {
      dispatch(userLoginStart())

      const nonce = await getUserNonce(account)
      const signature = await userSignMessage(library, account, nonce)
      ;({ user, accessToken } = await userAuthenticate(account, signature))
      user.lastRefreshed = new Date().toISOString()
      storage.setItem(`MM_TokenInfo_${account.toLowerCase()}`, JSON.stringify({ user, accessToken }))

      dispatch(userLoginSucceeded({ user, accessToken }))
    } catch (error: any) {
      dispatch(toastError('Error logging in', error?.message))
      dispatch(userLoginFailed())
    }
  }

export const logoutWallet = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  if (getState().user?.accessToken) {
    const user = await getLoggedInUser(getState().user.accessToken)
    storage.removeItem(`MM_TokenInfo_${user?.publicAddress?.toLowerCase()}`)
  }
  dispatch(userUnload())
}

export const loadLoggedInUser = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  if (getState().user.isLoading || !getState().user.accessToken) return

  try {
    dispatch(userLoadStart())

    const user = await getLoggedInUser(getState().user.accessToken)
    user.lastRefreshed = new Date().toISOString()
    storage.setItem(
      `MM_TokenInfo_${user.publicAddress.toLowerCase()}`,
      JSON.stringify({ user, accessToken: getState().user.accessToken }),
    )

    dispatch(userLoadSucceeded(user))
  } catch (error: any) {
    dispatch(toastError('Error loading user', error?.message))
    dispatch(userLoadFailed())
  }
}

export const updateUser = (user: Partial<User>) => async (dispatch: AppDispatch, getState: () => RootState) => {
  if (getState().user.isLoading || !getState().user.accessToken) return

  try {
    dispatch(userLoadStart())

    const userReturned = await userUpdate(getState().user.accessToken, user)
    userReturned.lastRefreshed = new Date().toISOString()
    sessionStorage.setItem(
      `MM_TokenInfo_${userReturned.publicAddress.toLowerCase()}`,
      JSON.stringify({ user: userReturned, accessToken: getState().user.accessToken }),
    )

    dispatch(userLoadSucceeded(userReturned))
  } catch (error: any) {
    dispatch(toastError('Error updating user', error?.message))
    dispatch(userLoadFailed())
  }
}
