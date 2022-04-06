import { useCallback, useEffect, useMemo, useState } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { createStructuredSelector } from 'reselect'
import { createCachedSelector } from 're-reselect'
import { isFinite, isNil, isObject, isString } from 'lodash'
import Web3 from 'web3'
import { Contract } from 'ethers'
import { useActiveWeb3React } from 'hooks/web3'
import { AppDispatch, RootState } from './store'
import { Toast } from '../components/Toast'
import { push as pushToast, remove as removeToast, clear as clearToast } from './actions'
import { loadLoggedInUser, loginWallet, updateUser } from './user/thunks'
import { User, commentData } from './types'
import { toastError, toastInfo, toastSuccess, toastWarning } from './toasts'
import { getCampaigns, getCampaign } from './campaigns/thunks'
import { getToken, getTokens, getUserTokens } from './tokens/thunks'
import { getTokenLock, getUserTokenLocks } from './tokenLocks/thunks'
import {
  userSignUpEmail,
  logInEmail,
  logOutEmail,
  getComments,
  getUpdateComment,
  removeComment,
} from './comment/thunks'
import { addedComment } from './comment/index'
import { createComment } from '../utils/apiHelper'
import { userUnload } from './user'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// Toasts

export const useToast = () => {
  const dispatch = useAppDispatch()
  const helpers = useMemo(() => {
    return {
      toastError,
      toastInfo,
      toastSuccess,
      toastWarning,
      push: (toast: Toast) => dispatch(pushToast(toast)),
      remove: (id: string) => dispatch(removeToast(id)),
      clear: () => dispatch(clearToast()),
    }
  }, [dispatch])

  return helpers
}

// User

export const useCheckLoginLogout = () => {
  const { account, library, active } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  const { data, isLoggedIn } = useAppSelector((state) => state.user)

  useEffect(() => {
    if (account && data?.publicAddress && account.toLowerCase() !== data.publicAddress.toLowerCase()) {
      dispatch(userUnload())
    }

    if (!isLoggedIn && active && account && library) {
      dispatch(loginWallet(library, account, true))
    } else if (isLoggedIn && !active && !account) {
      dispatch(userUnload())
    }
  }, [account, data, isLoggedIn, active, library, dispatch])
}

export const useLogin = () => {
  const { account, library } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  const login = useCallback(() => {
    if (account && library) {
      dispatch(loginWallet(library, account))
    }
  }, [account, library, dispatch])

  const logout = useCallback(() => {
    dispatch(userUnload())
  }, [dispatch])

  const { data, isLoggedIn, isLoading, accessToken } = useAppSelector((state) => state.user)
  return { isLoggedIn, isLoggingIn: isLoading, accessToken, user: data, account, login, logout }
}

export const useLoggedInUser = () => {
  const { account } = useActiveWeb3React()
  const { data, isLoggedIn, isLoading, accessToken } = useAppSelector((state) => state.user)
  return { isLoggedIn, isLoggingIn: isLoading, accessToken, user: data, account }
}

export const useUpdateUser = () => {
  const dispatch = useAppDispatch()
  const { account } = useActiveWeb3React()
  const handleUpdateUser = useCallback(
    (user: Partial<User>) => {
      if (account) dispatch(updateUser(user))
    },
    [dispatch, account],
  )
  return handleUpdateUser
}

export const useUserKYC = () => {
  const dispatch = useAppDispatch()
  const { account } = useActiveWeb3React()
  const { isLoggedIn, data } = useAppSelector((state) => state.user)

  const [triggered, setTriggered] = useState(false)
  useEffect(() => {
    if (!triggered && data && (!data.lastRefreshed || moment(data.lastRefreshed) < moment().subtract('1 hours'))) {
      setTriggered(true)
      dispatch(loadLoggedInUser())
    }
  }, [dispatch, data, triggered])

  const onStart = useCallback(() => {
    if (!account) dispatch(toastError('Verification error', 'Your wallet is not connected'))
    if (!isLoggedIn) dispatch(toastError('Verification error', 'You are not logged in'))
    return account && isLoggedIn
  }, [dispatch, account, isLoggedIn])

  const onSubmit = useCallback(
    (kycKey: string) => {
      if (account) dispatch(updateUser({ kycKey }))
    },
    [dispatch, account],
  )

  const onError = useCallback(
    (errorCode) => {
      dispatch(toastError('Verification error', errorCode))
    },
    [dispatch],
  )

  return { onStart, onSubmit, onError, account, kyced: data?.kyced, kycStatus: data?.kycStatus }
}

// Campaigns

export const useCampaigns = () => {
  const { account } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getCampaigns(account))
  }, [dispatch, account])

  const { data, isLoading } = useSelector((state: RootState) => state.campaigns)
  return { campaigns: data, campaignsLoading: isLoading }
}

const campaignSelector = createCachedSelector(
  (state: RootState) => state.campaigns,
  (_: RootState, campaignId: string | number) => campaignId,
  (campaigns, campaignId: string | number) =>
    isFinite(campaignId) ? campaigns.data[campaignId] : campaigns.dataByAddress[campaignId],
)((_: RootState, campaignId: string | number) => campaignId.toString())
const campaignStructuredSelector = createStructuredSelector({
  campaign: campaignSelector,
  isLoadingCampaign: (state: RootState) => state.campaigns.isLoading || state.campaigns.isLoadingCampaign,
})
export const useCampaign = (campaignId: string | number) => {
  const { account } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  const finalId = isString(campaignId) ? campaignId.toLowerCase() : campaignId
  const { campaign, isLoadingCampaign } = useAppSelector((state) => campaignStructuredSelector(state, finalId))

  useEffect(() => {
    if ((isFinite(finalId) && finalId >= 0) || (isString(finalId) && Web3.utils.isAddress(finalId))) {
      dispatch(getCampaign(finalId, account))
    }
  }, [dispatch, finalId, account])

  return { campaign, isLoadingCampaign }
}

// Tokens

const tokenSelector = createCachedSelector(
  (state: RootState) => state.tokens.data,
  (_: RootState, address: string) => address,
  (data, address: string) => data[address],
)((_: RootState, address: string) => address)
const tokenStructuredSelector = createStructuredSelector({
  token: tokenSelector,
  isLoadingToken: (state: RootState) => state.tokens.isLoading,
})
export const useToken = (address: string) => {
  const { account } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { token, isLoadingToken } = useSelector((state: RootState) =>
    tokenStructuredSelector(state, address?.toLowerCase()),
  )

  useEffect(() => {
    if (address && Web3.utils.isAddress(address)) {
      dispatch(getToken(address, account))
    }
  }, [dispatch, address, account])

  return { token, isLoadingToken }
}

export const useTokenWithApproval = (address: string, spender: string | Contract, refresh = false) => {
  const { account } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { token, isLoadingToken } = useSelector((state: RootState) =>
    tokenStructuredSelector(state, address?.toLowerCase()),
  )
  const spenderAddress = isObject(spender) ? spender.address : spender

  useEffect(() => {
    if (account && address && Web3.utils.isAddress(address) && spenderAddress && Web3.utils.isAddress(spenderAddress)) {
      dispatch(getToken(address, account, spenderAddress, refresh))
    }
  }, [dispatch, address, account, spenderAddress, refresh])
  return { token, isLoadingToken }
}

export const useTokens = (addresses: string[]) => {
  const { account } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { data, isLoading } = useSelector((state: RootState) => state.tokens)

  useEffect(() => {
    if (addresses) {
      dispatch(getTokens(addresses, account))
    }
  }, [dispatch, addresses, account])

  return { tokens: data, isLoadingTokens: isLoading }
}

export const useUserTokens = () => {
  const { library, account } = useActiveWeb3React()
  const signer = useMemo(() => (account ? library?.getSigner(account) : undefined), [library, account])
  const dispatch = useAppDispatch()
  const { userTokens, isLoading } = useSelector((state: RootState) => state.tokens)

  useEffect(() => {
    if (signer) {
      dispatch(getUserTokens(signer))
    }
  }, [dispatch, signer])

  return { tokens: userTokens, isLoadingTokens: isLoading }
}

// Token locks

export const useUserTokenLocks = () => {
  const { library, account } = useActiveWeb3React()
  const signer = useMemo(() => (account ? library?.getSigner(account) : undefined), [library, account])
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (signer) {
      dispatch(getUserTokenLocks(signer))
    }
  }, [dispatch, signer])

  const { userLocks, isLoading } = useSelector((state: RootState) => state.tokenLocks)
  return { tokenLocks: userLocks[account], isLoadingLocks: isLoading }
}

const tokenLockSelector = createCachedSelector(
  (state: RootState) => state.tokenLocks.data,
  (_: RootState, lockId: number) => lockId,
  (data, lockId: number) => data[lockId],
)((_: RootState, lockId: number) => lockId)
const tokenLockStructuredSelector = createStructuredSelector({
  lock: tokenLockSelector,
  isLoadingLock: (state: RootState) => state.tokenLocks.isLoading,
})
export const useTokenLock = (lockId: number) => {
  const dispatch = useAppDispatch()
  const { lock, isLoadingLock } = useSelector((state: RootState) => tokenLockStructuredSelector(state, lockId))

  useEffect(() => {
    if (!isNil(lockId)) {
      dispatch(getTokenLock(lockId))
    }
  }, [dispatch, lockId])

  return { lock, isLoadingLock }
}

export const useTokenAndLock = (lockId: number) => {
  const { lock, isLoadingLock } = useTokenLock(lockId)
  const tokenAddress = useMemo(() => lock?.token, [lock?.token])
  const { token, isLoadingToken } = useToken(tokenAddress)
  return { lock, token, isLoading: isLoadingLock || isLoadingToken }
}

// Prices

const coingeckoApi =
  'https://api.coingecko.com/api/v3/coins/{id}?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false'
export const useGetPriceDataFromCoingecko = (id: string) => {
  const [data, setData] = useState<any | null>(null)
  const finalApi = coingeckoApi.replace('{id}', id)

  useEffect(() => {
    if (data) return
    const fetchData = async () => {
      try {
        const response = await fetch(finalApi)
        const res: any = await response.json()

        setData(res)
      } catch (error) {
        console.error('Unable to fetch price data:', error)
      }
    }

    fetchData()
  }, [finalApi, setData, data])

  return data
}

// Email

export const useEmailLoginLogout = async () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(logInEmail())
  }, [dispatch])
}

export const useUserEmail = () => {
  const dispatch = useAppDispatch()

  const userSignUp = useCallback(
    async (signUp) => {
      dispatch(userSignUpEmail(signUp))
    },
    [dispatch],
  )

  const responseUser = useCallback(
    async (login) => {
      dispatch(logInEmail(login))
    },
    [dispatch],
  )

  const logOut = useCallback(() => {
    dispatch(logOutEmail())
  }, [dispatch])

  return { signUp: userSignUp, userLogin: responseUser, logOut }
}

export const useUserEmailInfo = () => {
  const { isLogIn, user, isSignUp } = useAppSelector((state) => state.comment)
  return { isLogIn, user, isSignUp }
}

// Comments

export const useUserComments = () => {
  const { user } = useUserEmailInfo()
  const dispatch = useAppDispatch()

  const addComment = useCallback(
    async (message, campaignAddress, userId, userName) => {
      if (user) {
        const data: Partial<commentData> = { message, campaignAddress, userId, userName }
        const abc = await createComment(data)
        dispatch(addedComment(abc))
      }
    },
    [dispatch, user],
  )

  const ShowComment = (campaignId: string) => {
    useEffect(() => {
      dispatch(getComments(campaignId))
    }, [campaignId])
    const { comments } = useAppSelector((state) => state.comment)
    return comments
  }

  const handleUpdateComment = useCallback(
    async (id, comment, campaignAddress) => {
      dispatch(getUpdateComment({ id, comment }, campaignAddress))
    },
    [dispatch],
  )

  const deleteComment = useCallback(
    async (campaignAddress: string, id: number) => {
      dispatch(removeComment(campaignAddress, id))
    },
    [dispatch],
  )

  const handleReply = useCallback(
    async (responseTo, comment, campaignAddress, userId, userName) => {
      const data = { responseTo, comment, campaignAddress, userId, userName }
      const abc = await createComment(data)
      dispatch(addedComment(abc))
    },
    [dispatch],
  )

  return {
    createComment: addComment,
    updateComment: handleUpdateComment,
    ShowComment,
    deleteComment,
    reply: handleReply,
  }
}
