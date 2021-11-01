import { useCallback, useEffect, useMemo, useState } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { isEmpty, isFinite, isNil, isObject, isString } from 'lodash'
import Web3 from 'web3'
import { Contract } from 'ethers'
import { BaseContract } from 'config/types/types'
import { useActiveWeb3React } from 'hooks/web3'
import useActiveWeb3 from 'hooks/useActiveWeb3'
import useUserVerification from 'hooks/useUserKYC'
import { AppDispatch, RootState } from './store'
import { Toast } from '../components/Toast'
import { push as pushToast, remove as removeToast, clear as clearToast } from './actions'
import { loginWallet, logoutWallet, updateUser } from './user/thunks'
import { User, UserState, commentData } from './types'
import { toastError, toastInfo, toastSuccess, toastWarning } from './toasts'
import { getCampaigns, getCampaign } from './campaigns/thunks'
import { getToken, getTokens, getUserTokens } from './tokens/thunks'
import { getTokenLock, getUserTokenLocks } from './tokenLocks/thunks'
import { userSignUpEmail, logInEmail, logOutEmail, getComments, getUpdateComment, removeComment } from './comment/thunks';
import { addedComment } from './comment/index';
import { createComment } from '../utils/apiHelper'


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
  const { account, active } = useActiveWeb3React()
  const web3 = useActiveWeb3()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (active && account && web3) {
      dispatch(loginWallet(web3, account, true))
    } else if (active && web3) {
      dispatch(logoutWallet())
    }
  }, [account, active, web3, dispatch])
}

export const useLoginWallet = () => {
  const { account } = useActiveWeb3React()
  const web3 = useActiveWeb3()
  const dispatch = useAppDispatch()

  return useCallback(() => {
    if (account && web3) {
      dispatch(loginWallet(web3, account))
    }
  }, [account, web3, dispatch])
}

export const useLoggedInUser = () => {
  const { account } = useActiveWeb3React()
  const { isLoggedIn, isLoggingIn, username, accessToken }: UserState = useAppSelector((state) => state.user)
  return { isLoggedIn, isLoggingIn, username, accessToken, account }
}

export const useUpdateUser = () => {
  const dispatch = useAppDispatch()
  return useMemo(() => {
    return (user: Partial<User>) => dispatch(updateUser(user))
  }, [dispatch])
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

export const useCampaign = (campaignId: string | number) => {
  const { account } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  const finalId = isString(campaignId) ? campaignId.toLowerCase() : campaignId
  const { campaign, isLoadingCampaign } = useSelector((state: RootState) => ({
    campaign: isFinite(finalId) ? state.campaigns.data[finalId] : state.campaigns.dataByAddress[finalId],
    isLoadingCampaign: state.campaigns.isLoadingCampaign,
  }))

  useEffect(() => {
    if ((isFinite(finalId) && finalId >= 0) || (isString(finalId) && Web3.utils.isAddress(finalId))) {
      dispatch(getCampaign(finalId, account))
    }
  }, [dispatch, finalId, account])

  return { campaign, isLoadingCampaign }
}

// Tokens

export const useToken = (address: string) => {
  const { account } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { token, isLoadingToken } = useSelector((state: RootState) => ({
    token: state.tokens.data[address],
    isLoadingToken: state.tokens.isLoading,
  }))

  useEffect(() => {
    if (address && Web3.utils.isAddress(address)) {
      dispatch(getToken(address, account))
    }
  }, [dispatch, address, account])

  return { token, isLoadingToken }
}

export const useTokenWithApproval = (address: string, spender: string | Contract | BaseContract) => {
  const { account } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { token, isLoadingToken } = useSelector((state: RootState) => ({
    token: state.tokens.data[address?.toLowerCase()],
    isLoadingToken: state.tokens.isLoading,
  }))
  const spenderAddress = isObject(spender) ? (spender as BaseContract).options.address : spender

  useEffect(() => {
    if (account && address && Web3.utils.isAddress(address) && spenderAddress && Web3.utils.isAddress(spenderAddress)) {
      dispatch(getToken(address, account, spenderAddress))
    }
  }, [dispatch, address, account, spenderAddress])
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
  const { account } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { userTokens, isLoading } = useSelector((state: RootState) => state.tokens)

  useEffect(() => {
    if (account) {
      dispatch(getUserTokens(account))
    }
  }, [dispatch, account])

  return { tokens: userTokens, isLoadingTokens: isLoading }
}

// Token locks

export const useUserTokenLocks = () => {
  const { account } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (account) {
      dispatch(getUserTokenLocks(account))
    }
  }, [dispatch, account])

  const { userLocks, isLoading } = useSelector((state: RootState) => state.tokenLocks)
  return { tokenLocks: userLocks[account], isLoadingLocks: isLoading }
}

export const useTokenLock = (lockId: number) => {
  const dispatch = useAppDispatch()
  const { lock, isLoadingLock } = useSelector((state: RootState) => ({
    lock: state.tokenLocks.data[lockId],
    isLoadingLock: state.tokenLocks.isLoading,
  }))

  useEffect(() => {
    if (!isNil(lockId)) {
      dispatch(getTokenLock(lockId))
    }
  }, [dispatch, lockId])

  return { lock, isLoadingLock }
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
    }, [dispatch]);

  const responseUser = useCallback(
    async (login) => {

      dispatch(logInEmail(login))
    }, [dispatch])

  const logOut = useCallback(
    () => {
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

  const { user } = useUserEmailInfo();
  const dispatch = useAppDispatch()

  const addComment = useCallback(
    async (message, campaignAddress, userId, userName) => {
      if (user) {
        const data: Partial<commentData> = { message, campaignAddress, userId, userName };
        const abc = await createComment(data);
        dispatch(addedComment(abc));
      }
    }, [dispatch, user])

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
    }, [dispatch])

  const deleteComment = useCallback(
    async (campaignAddress: string, id: number) => {
      dispatch(removeComment(campaignAddress, id))
    }, [dispatch])

  const handleReply = useCallback(
    async (responseTo, comment, campaignAddress, userId, userName) => {
      const data = { responseTo, comment, campaignAddress, userId, userName }
      console.log('reply', data);
      const abc = await createComment(data);
      dispatch(addedComment(abc));
    }, [dispatch])

  return { createComment: addComment, updateComment: handleUpdateComment, ShowComment, deleteComment, reply: handleReply }
}

