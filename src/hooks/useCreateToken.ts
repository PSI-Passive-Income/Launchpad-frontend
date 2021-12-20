import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toastError } from 'state/actions'
import { TokenCreationInfo } from 'state/types'
import { createToken, handleTransaction } from 'utils/callHelpers'
import { useTokenFactory } from './useContract'
import { useActiveWeb3React } from './web3'

const useCreateToken = () => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const tokenFactory = useTokenFactory()
  const history = useHistory()
  const [creating, setCreating] = useState(false)

  const handleCreateToken = useCallback(
    async (token: Partial<TokenCreationInfo>) => {
      if (account && tokenFactory && history && token) {
        try {
          setCreating(true)
          const transaction = await createToken(tokenFactory, account, token)
          const success = handleTransaction(transaction)
          if (success) {
            history.push(`/manage-tokens`)
          } else {
            dispatch(toastError('Error adding token', 'Transaction failed'))
          }
        } catch (error: any) {
          dispatch(toastError('Error adding token', error?.message))
        } finally {
          setCreating(false)
        }
      }
    },
    [dispatch, account, tokenFactory, history],
  )

  return { createToken: handleCreateToken, creatingToken: creating }
}

export default useCreateToken