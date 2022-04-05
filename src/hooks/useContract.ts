import { useMemo } from 'react'
import {
  getBep20Contract,
  getPSIContact,
  getCampaignContract,
  getCampaignFactoryContract,
  getTokenFactoryContract,
  getTokenLockFactoryContract,
} from 'utils/contractHelpers'
import { useActiveWeb3React } from './web3'

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useSigner = () => {
  const { library, account, chainId } = useActiveWeb3React()
  const signer = useMemo(() => (chainId ? library?.getSigner(account) : library), [library, account, chainId])
  return signer ?? library
}

export const useBEP20 = (address: string) => {
  const signer = useSigner()
  return useMemo(() => (address ? getBep20Contract(address, signer) : null), [address, signer])
}

export const usePSI = () => {
  const signer = useSigner()
  return useMemo(() => getPSIContact(signer), [signer])
}

export const useCampaign = (address: string) => {
  const signer = useSigner()
  return useMemo(() => getCampaignContract(address, signer), [address, signer])
}

export const useCampaignFactory = () => {
  const signer = useSigner()
  return useMemo(() => getCampaignFactoryContract(signer), [signer])
}

export const useTokenFactory = () => {
  const signer = useSigner()
  return useMemo(() => getTokenFactoryContract(signer), [signer])
}

export const useTokenLockFactory = () => {
  const signer = useSigner()
  return useMemo(() => getTokenLockFactoryContract(signer), [signer])
}
