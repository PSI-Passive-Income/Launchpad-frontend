import { Web3Provider } from '@ethersproject/providers'
import { Contract, ContractInterface } from '@ethersproject/contracts'
import { Signer } from '@ethersproject/abstract-signer'

// Addresses
import {
  getPSIAddress,
  getCampaignFactoryAddress,
  getTokenFactoryAddress,
  getTokenLockFactoryAddress,
} from 'utils/addressHelpers'

// Contract types
import { IBEP20 } from "config/types/IBEP20"
import { PSIPadCampaign } from "config/types/PSIPadCampaign"
import { PSIPadCampaignFactory } from "config/types/PSIPadCampaignFactory"
import { PSIPadTokenDeployer } from "config/types/PSIPadTokenDeployer"
import { PSIPadTokenLockFactory } from "config/types/PSIPadTokenLockFactory"

// ABI
import bep20Abi from 'config/abi/IBEP20.json'
import campaignAbi from 'config/abi/PSIPadCampaign.json'
import campaignFactoryAbi from 'config/abi/PSIPadCampaignFactory.json'
import tokenFactoryAbi from 'config/abi/PSIPadTokenDeployer.json'
import tokenLockFactoryAbi from 'config/abi/PSIPadTokenLockFactory.json'

const getContract = (address: string, abi: ContractInterface, signerOrProvider?: Web3Provider | Signer) => {
  return new Contract(address, abi, signerOrProvider)
}

export const getBep20Contract = (address: string, signerOrProvider?: Web3Provider | Signer) => {
  return getContract(address, bep20Abi, signerOrProvider) as unknown as IBEP20
}

export const getPSIContact = (signerOrProvider?: Web3Provider | Signer) => {
  return getBep20Contract(getPSIAddress(), signerOrProvider)
}

export const getCampaignContract = (address: string, signerOrProvider?: Web3Provider | Signer) => {
  return getContract(address, campaignAbi, signerOrProvider) as unknown as PSIPadCampaign
}

export const getCampaignFactoryContract = (signerOrProvider?: Web3Provider | Signer) => {
  return getContract(getCampaignFactoryAddress(), campaignFactoryAbi, signerOrProvider) as unknown as PSIPadCampaignFactory
}

export const getTokenFactoryContract = (signerOrProvider?: Web3Provider | Signer) => {
  return getContract(getTokenFactoryAddress(), tokenFactoryAbi, signerOrProvider) as unknown as PSIPadTokenDeployer
}

export const getTokenLockFactoryContract = (signerOrProvider?: Web3Provider | Signer) => {
  return getContract(getTokenLockFactoryAddress(), tokenLockFactoryAbi, signerOrProvider) as unknown as PSIPadTokenLockFactory
}
