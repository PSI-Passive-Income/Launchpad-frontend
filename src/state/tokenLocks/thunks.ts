import { toastError } from 'state/toasts'
import { AppDispatch } from '../store'
import { TokenLock } from '../types'
import { locksLoadStart, locksLoadSucceeded, locksLoadFailed } from '.'
import { fetchLocks, fetchLock } from './fetchLocks'

// Thunks

export const getUserTokenLocks = (account: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(locksLoadStart())
    const locks: TokenLock[] = await fetchLocks(account)
    dispatch(locksLoadSucceeded(locks))
  } catch (error) {
    dispatch(toastError('Error retrieving token locks', error?.message))
    dispatch(locksLoadFailed(error?.message))
  }
}

export const getTokenLock = (lockId: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(locksLoadStart())
    const lock: TokenLock = await fetchLock(lockId)
    dispatch(locksLoadSucceeded([lock]))
  } catch (error) {
    dispatch(toastError('Error retrieving token locks', error?.message))
    dispatch(locksLoadFailed(error?.message))
  }
}
