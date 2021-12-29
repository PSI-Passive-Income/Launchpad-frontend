import { JsonRpcSigner } from '@ethersproject/providers'
import { toastError } from 'state/toasts'
import { AppDispatch } from '../store'
import { TokenLock } from '../types'
import { locksLoadStart, locksLoadSucceeded, locksLoadFailed } from '.'
import { fetchLocks, fetchLock } from './fetchLocks'

// Thunks

export const getUserTokenLocks = (signer: JsonRpcSigner) => async (dispatch: AppDispatch) => {
  try {
    dispatch(locksLoadStart())
    const locks: TokenLock[] = await fetchLocks(signer)
    dispatch(locksLoadSucceeded(locks))
  } catch (error: any) {
    dispatch(toastError('Error retrieving token locks', error?.message))
    dispatch(locksLoadFailed(error?.message))
  }
}

export const getTokenLock = (lockId: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(locksLoadStart())
    const lock: TokenLock = await fetchLock(lockId)
    dispatch(locksLoadSucceeded([lock]))
  } catch (error: any) {
    dispatch(toastError('Error retrieving token locks', error?.message))
    dispatch(locksLoadFailed(error?.message))
  }
}
