import { isEmpty, isNil } from 'lodash'
import { BigNumberish } from '@ethersproject/bignumber'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getTokenLock, toastError } from 'state/actions'
import { TokenLock } from 'state/types'
import {
  createTokenLock,
  getUserLocks,
  handleTransaction,
  unlockAvailableToken,
  unlockTokenAmount,
} from 'utils/callHelpers'
import { useTokenLockFactory } from './useContract'
import { useActiveWeb3React } from './web3'
import useApproval from './useApproval'

export const useUnlockToken = () => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const lockFactory = useTokenLockFactory()
  const [unlocking, setUnlocking] = useState(false)

  const handleUnlock = useCallback(
    async (lockId: number, amount?: BigNumberish) => {
      if (account && lockFactory) {
        try {
          setUnlocking(true)
          const transaction = await (isNil(amount)
            ? unlockAvailableToken(lockFactory, account, lockId)
            : unlockTokenAmount(lockFactory, account, lockId, amount))
          const success = handleTransaction(transaction)
          if (success) {
            dispatch(getTokenLock(lockId))
          } else {
            dispatch(toastError('Error adding campaign', 'Transaction failed'))
          }
        } catch (error: any) {
          dispatch(toastError('Error unlocking token', error?.message))
        } finally {
          setUnlocking(false)
        }
      }
    },
    [dispatch, account, lockFactory],
  )

  return { unlock: handleUnlock, unlocking }
}

export const useTokenLockFactoryApproval = (tokenAddress: string) => {
  const lockFactory = useTokenLockFactory()
  return useApproval(tokenAddress, lockFactory?.address)
}

export const useCreateTokenLock = () => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const lockFactory = useTokenLockFactory()
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)

  const handleCreateTokenLock = useCallback(
    async (lock: Partial<TokenLock>) => {
      if (account && lock && navigate) {
        try {
          setCreating(true)
          const transaction = await createTokenLock(lockFactory, account, lock)
          const success = handleTransaction(transaction)
          if (success) {
            const lockIds = await getUserLocks(lockFactory, account)
            if (!isEmpty(lockIds)) {
              navigate(`/lock/${lockIds[lockIds.length - 1]}`)
            } else {
              dispatch(toastError('Error creating lock', 'Lock is not found on the contract'))
            }
          } else {
            dispatch(toastError('Error creating lock', 'Transaction failed'))
          }
        } catch (error: any) {
          dispatch(toastError('Error creating lock', error?.message))
        } finally {
          setCreating(false)
        }
      }
    },
    [dispatch, account, lockFactory, navigate],
  )

  return { createLock: handleCreateTokenLock, creatingLock: creating }
}
