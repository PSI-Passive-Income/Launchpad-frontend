import { JsonRpcSigner } from '@ethersproject/providers'
import PSIPadTokenLockFactoryAbi from 'config/abi/PSIPadTokenLockFactory.json'
import { first, isEmpty, isNil, toFinite } from 'lodash'
import { TokenLock } from 'state/types'
import { getTokenLockFactoryAddress } from 'utils/addressHelpers'
import { getUserLocks } from 'utils/callHelpers'
import { getTokenLockFactoryContract } from 'utils/contractHelpers'
import { toBigNumber, unixTSToDate } from 'utils/converters'
import { Call, nestedMulticall } from 'utils/multicall'

const convertLockData = (lockId: number, callData: any[]): TokenLock => {
  if (isEmpty(callData)) return null

  const lockData = callData[0].flat()
  const lock: TokenLock = {
    id: lockId,
    owner: lockData[0],
    token: lockData[1],
    amount: toBigNumber(lockData[2]),
    startTime: unixTSToDate(lockData[3]),
    duration: toFinite(lockData[4]) * 1000,
    releases: toFinite(lockData[5]),
    amountUnlocked: toBigNumber(lockData[6]),
    amountToUnlock: toBigNumber(callData.flat()[1]),
    unlockedAmount: toBigNumber(callData.flat()[2]),
  }
  if (lock.startTime && lock.duration) lock.unlockTime = new Date(lock.startTime.getTime() + lock.duration)
  return lock
}

const _fetchLocks = async (lockIds: number[]) => {
  const address = getTokenLockFactoryAddress()

  const nestedCalls: Call[][] = lockIds.map((lockId) => [
    { address, name: 'tokensLocked', params: [lockId] },
    { address, name: 'amountToUnlock', params: [lockId] },
    { address, name: 'unlockedAmount', params: [lockId] },
  ])

  const callData = await nestedMulticall(PSIPadTokenLockFactoryAbi, nestedCalls, false)
  return callData.map((lock: any[], idx: number) => convertLockData(lockIds[idx], lock)).filter((l) => !isNil(l))
}

export const fetchLocks = async (signer: JsonRpcSigner): Promise<TokenLock[]> => {
  if (!signer) return null

  const lockFactory = getTokenLockFactoryContract(signer)
  const lockIds = await getUserLocks(lockFactory, signer._address)
  return _fetchLocks(lockIds)
}

export const fetchLock = async (lockId: number): Promise<TokenLock> => {
  if (isNil(lockId)) return null
  return first(await _fetchLocks([lockId]))
}
