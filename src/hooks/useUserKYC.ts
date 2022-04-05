import { useCallback, useState } from 'react'
import { useLoggedInUser } from 'state/hooks'
import { toastError } from 'state/actions'
import { useDispatch } from 'react-redux'
import { useActiveWeb3React } from 'hooks/web3'
import { setkycUserVerification, getKYCuserVerifcation, updateCampaignKyc } from '../utils/apiHelper'

const useUserVerification = () => {
  const dispatch = useDispatch()

  const { account } = useActiveWeb3React()
  const { accessToken } = useLoggedInUser()

  const [verified, setVerified] = useState(false)

  const onStart = useCallback(() => {
    if (!account) {
      dispatch(toastError('Error Verification', 'Please check wallet connection'))
    }
  }, [dispatch, account])

  const onSumit = useCallback(
    async (key) => {
      const kyc = await setkycUserVerification(account, key)
      await updateCampaignKyc(accessToken, kyc, account)
    },
    [account, accessToken],
  )

  const onError = useCallback(
    async (errorCode) => {
      dispatch(toastError('Error Verification', errorCode))
    },
    [dispatch],
  )

  const getUserVerified = async () => {
    const user = await getKYCuserVerifcation(account)
    setVerified(user)
  }
  getUserVerified()
  return { submit: onSumit, start: onStart, error: onError, account, accessToken, verified }
}

export default useUserVerification
