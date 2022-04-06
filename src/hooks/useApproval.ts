import { useCallback, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTokenWithApproval } from 'state/hooks'
import { approve, handleTransactionCall } from 'utils/callHelpers'
import { useBEP20 } from './useContract'
import { useActiveWeb3React } from './web3'

const useApproval = (tokenAddress: string, spender: string) => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const tokenContract = useBEP20(tokenAddress)
  const [approving, setApproving] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const { token, isLoadingToken } = useTokenWithApproval(tokenAddress, spender, refresh)

  const handleApprove = useCallback(async () => {
    if (dispatch && account && spender && tokenContract) {
      setApproving(true)
      const success = await handleTransactionCall(() => approve(tokenContract, account, spender), dispatch)
      if (success) setRefresh(true)
      setApproving(false)
    }
  }, [dispatch, account, spender, tokenContract])

  const approvedAmount = useMemo(() => token?.approvals[spender], [token?.approvals, spender])

  return { token, isLoadingToken, approve: handleApprove, approving, approvedAmount }
}

export default useApproval
