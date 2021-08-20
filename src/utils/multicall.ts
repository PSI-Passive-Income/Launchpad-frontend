import { AbiItem } from 'web3-utils'
import { Interface } from '@ethersproject/abi'
import { getWeb3NoAccount } from 'utils/web3'
import MultiCallAbi from 'config/abi/multicall.json'
import { getMulticallAddress } from 'utils/addressHelpers'

export interface Call {
  address: string // Address of the contract
  name: string // Function name on the contract (example: balanceOf)
  params?: any[] // Function params
}

export const nestedMulticall = async (abi: any[], nestedCalls: Call[][]): Promise<any[][]> => {
  const calls: Call[] = nestedCalls.flat()
  const callResults = await multicall(abi, calls)

  const allRes: any[][] = []
  return nestedCalls.reduce((acc, res) => [...acc, callResults.splice(0, res.length - 1)], allRes)
}

export const multicall = async (abi: any[], calls: Call[]): Promise<any[]> => {
  const web3 = getWeb3NoAccount()
  const multi = new web3.eth.Contract(MultiCallAbi as unknown as AbiItem, getMulticallAddress())
  const itf = new Interface(abi)

  const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])
  const { returnData } = await multi.methods.aggregate(calldata).call()
  return returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))
}
