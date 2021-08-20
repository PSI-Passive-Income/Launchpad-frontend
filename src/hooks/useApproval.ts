import { useCallback, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toastError } from 'state/actions'
import { useTokenWithApproval } from 'state/hooks'
import { approve } from 'utils/callHelpers'
import { useBEP20 } from './useContract'
import { useActiveWeb3React } from './web3'

const useApproval = (tokenAddress: string, spender: string) => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const tokenContact = useBEP20(tokenAddress)
  const [approving, setApproving] = useState(false)
  const { token, isLoadingToken } = useTokenWithApproval(tokenAddress, spender)

  const handleApprove = useCallback(async () => {
    try {
      setApproving(true)
      await approve(tokenContact, account, spender)
    } catch (error) {
      dispatch(toastError('Error approving tokens', error?.message))
    } finally {
      setApproving(false)
    }
  }, [dispatch, account, spender, tokenContact])

  const approvedAmount = useMemo(
    () => token?.approvals[spender],
    [token?.approvals, spender],
  )

  return { token, isLoadingToken, approve: handleApprove, approving, approvedAmount }
}

export default useApproval