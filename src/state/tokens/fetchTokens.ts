import IBEP20Abi from 'config/abi/IBEP20.json'
import { first, toFinite } from 'lodash'
import { Token } from 'state/types'
import { getUserTokens } from 'utils/callHelpers'
import { getTokenFactoryContract } from 'utils/contractHelpers'
import { toBigNumber } from 'utils/converters'
import { Call, nestedMulticall } from 'utils/multicall'

export const fetchTokens = async (
  tokenAddresses: string[],
  account?: string,
  spender?: string,
): Promise<Token[]> => {
  if (!tokenAddresses) return []

  const nestedCalls: Call[][] = tokenAddresses.map((tokenAddress) => {
    const calls: Call[] = []
    calls.push({ address: tokenAddress, name: 'name' })
    calls.push({ address: tokenAddress, name: 'symbol' })
    calls.push({ address: tokenAddress, name: 'decimals' })
    calls.push({ address: tokenAddress, name: 'totalSupply' })

    if (account) {
      calls.push({ address: tokenAddress, name: 'balanceOf', params: [account] })
      if (spender) calls.push({ address: tokenAddress, name: 'allowance', params: [account, spender] })
    }
    return calls
  })

  const tokensData = await nestedMulticall(IBEP20Abi, nestedCalls)

  return tokensData?.reduce((result: Token[], tokenData: any[], idx: number) => {
    const token: Token = {
      address: tokenAddresses[idx].toLowerCase(),
      name: tokenData[0],
      symbol: tokenData[1],
      decimals: toFinite(tokenData[2]),
      totalSupply: toBigNumber(tokenData[3]),
    }
    if (account) token.accountBalance = toBigNumber(tokenData[4])
    if (account && spender) token.approvals = { ...token.approvals, [spender]: toBigNumber(tokenData[5]) }
    return [...result, token]
  }, [])
}

export const fetchToken = async (tokenAddress: string, account?: string, spender?: string): Promise<Token> => {
  const tokens = await fetchTokens([tokenAddress], account, spender)
  return first(tokens)
}

export const fetchUserTokens = async (account: string) => {
  if (!account) return []

  const tokenFactory = getTokenFactoryContract()
  return getUserTokens(tokenFactory, account)
}