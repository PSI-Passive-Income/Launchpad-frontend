import { useCallback, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getToken, toastError } from 'state/actions'
import { useTokenWithApproval } from 'state/hooks'
import { approve } from 'utils/callHelpers'
import { useBEP20 } from './useContract'
import { useActiveWeb3React } from './web3'

const useApproval = (tokenAddress: string, spender: string) => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const tokenContract = useBEP20(tokenAddress)
  const [approving, setApproving] = useState(false)
  const { token, isLoadingToken } = useTokenWithApproval(tokenAddress, spender)

  const handleApprove = useCallback(async () => {
    if (dispatch && account && spender && tokenContract) {
      try {
        setApproving(true)
        await approve(tokenContract, account, spender)
        dispatch(getToken(tokenAddress, account, spender, true))
      } catch (error) {
        dispatch(toastError('Error approving tokens', error?.message))
      } finally {
        setApproving(false)
      }
    }
  }, [dispatch, tokenAddress, account, spender, tokenContract])

  const approvedAmount = useMemo(
    () => token?.approvals[spender],
    [token?.approvals, spender],
  )

  return { token, isLoadingToken, approve: handleApprove, approving, approvedAmount }
}

export default useApproval