import random from 'lodash/random'
import { CHAIN_INFO } from 'config/constants/chains'

const getNodeUrl = () => {
  const nodeOverride = process.env.REACT_APP_NODE_OVERRIDE
  if (nodeOverride) return nodeOverride

  const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)
  const chain = CHAIN_INFO[chainId]
  if (chain) {
    const randomIndex = random(0, chain.rpc.length - 1)
    return chain.rpc[randomIndex]
  }
  throw new Error('Chain not found')
}

export default getNodeUrl
