import PSIPadTokenLockFactoryAbi from '@passive-income/launchpad-contracts/abi/contracts/PSIPadTokenLockFactory.sol/PSIPadTokenLockFactory.json'
import { isEmpty, isNil, toFinite } from 'lodash'
import { TokenLock } from 'state/types'
import { getUserLocks, getTokenLock } from 'utils/callHelpers'
import { getTokenLockFactoryContract } from 'utils/contractHelpers'
import { toBigNumber, unixTSToDate } from 'utils/converters'
import { Call, multicall } from 'utils/multicall'

const convertLockData = (lockId: number, lockData: string[] | any): TokenLock => {
  if (isEmpty(lockData)) return null
  const lock: TokenLock = {
    id: lockId,
    owner: lockData[0],
    token: lockData[1],
    amount: toBigNumber(lockData[2]),
    startTime: unixTSToDate(lockData[3]),
    duration: toFinite(lockData[4]) * 1000,
    releases: toFinite(lockData[5]),
    amountUnlocked: toBigNumber(lockData[6]),
  }
  if (lock.startTime && lock.duration) lock.unlockTime = new Date(lock.startTime.getTime() + lock.duration)
  return lock
}

export const fetchLocks = async (account: string): Promise<TokenLock[]> => {
  if (!account) return null

  const lockFactory = getTokenLockFactoryContract()
  const userLocks = await getUserLocks(lockFactory, account)

  const calls: Call[] = userLocks.map((id) => ({
    address: lockFactory.options.address,
    name: 'tokensLocked',
    params: [id],
  }))
  const tokenData = await multicall(PSIPadTokenLockFactoryAbi, calls, false)

  return tokenData.map((lock: any[], idx: number) => convertLockData(userLocks[idx], lock?.flat())).filter((l) => !isNil(l))
}

export const fetchLock = async (lockId: number): Promise<TokenLock> => {
  if (isNil(lockId)) return null

  const lockFactory = getTokenLockFactoryContract()
  const lockData = await getTokenLock(lockFactory, lockId)
  return convertLockData(lockId, lockData)
}
