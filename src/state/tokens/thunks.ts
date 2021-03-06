import { JsonRpcSigner } from '@ethersproject/providers'
import { toastError } from 'state/toasts'
import { isNil, isUndefined } from 'lodash'
import { AppDispatch, RootState } from '../store'
import { Token } from '../types'
import { tokenLoadStart, tokenLoadSucceeded, tokensLoadSucceeded, tokensUserLoadSucceeded, tokenLoadFailed } from '.'
import { fetchToken, fetchTokens, fetchUserTokens } from './fetchTokens'

// Thunks

export const getToken =
  (tokenAddress: string, account?: string, spender?: string, refresh = false) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const currentToken = getState()?.tokens?.data[tokenAddress?.toLowerCase()]
    const approvals = currentToken?.approvals
    if (currentToken && !refresh && !(spender && (!approvals || isUndefined(approvals[spender])))) return

    try {
      dispatch(tokenLoadStart())
      const token: Token = await fetchToken(tokenAddress, account, spender)
      dispatch(tokenLoadSucceeded(token))
    } catch (error: any) {
      dispatch(toastError('Error retrieving token data', error?.message))
      dispatch(tokenLoadFailed(error?.message))
    }
  }

export const getTokens =
  (tokenAddresses: string[], account?: string, spender?: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const tokensToGet = tokenAddresses?.filter((t) => isNil(getState()?.tokens?.data[t?.toLowerCase()]))
    if (!tokensToGet) return

    try {
      dispatch(tokenLoadStart())
      const tokens: Token[] = await fetchTokens(tokensToGet, account, spender)
      dispatch(tokensLoadSucceeded(tokens))
    } catch (error: any) {
      dispatch(toastError('Error retrieving tokens data', error?.message))
      dispatch(tokenLoadFailed(error?.message))
    }
  }

export const getUserTokens =
  (signer: JsonRpcSigner, spender?: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(tokenLoadStart())

      const userTokens = await fetchUserTokens(signer)
      const tokens: Token[] = userTokens
        ?.map((t) => getState()?.tokens?.data[t?.toLowerCase()])
        .filter((t) => !isNil(t))
      const tokensToGet = userTokens?.filter((t) => isNil(getState()?.tokens?.data[t?.toLowerCase()]))
      if (tokensToGet) {
        tokens.push(...(await fetchTokens(tokensToGet, signer._address, spender)))
      }

      dispatch(tokensUserLoadSucceeded(tokens))
    } catch (error: any) {
      dispatch(toastError('Error retrieving user tokens data', error?.message))
      dispatch(tokenLoadFailed(error?.message))
    }
  }
