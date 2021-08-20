import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import web3NoAccount from 'utils/web3'

// Addresses
import {
  getPSIAddress,
  getCampaignFactoryAddress,
  getTokenFactoryAddress,
  getTokenLockFactoryAddress,
} from 'utils/addressHelpers'

// Contract types
import { IBEP20 } from "@passive-income/launchpad-contracts/typechain-web3/IBEP20"
import { PSIPadCampaign } from "@passive-income/launchpad-contracts/typechain-web3/PSIPadCampaign"
import { PSIPadCampaignFactory } from "@passive-income/launchpad-contracts/typechain-web3/PSIPadCampaignFactory"
import { PSIPadTokenDeployer } from "@passive-income/launchpad-contracts/typechain-web3/PSIPadTokenDeployer"
import { PSIPadTokenLockFactory } from "@passive-income/launchpad-contracts/typechain-web3/PSIPadTokenLockFactory"

// ABI
import bep20Abi from '@passive-income/launchpad-contracts/abi/contracts/token/interfaces/IBEP20.sol/IBEP20.json'
import campaignAbi from '@passive-income/launchpad-contracts/abi/contracts/PSIPadCampaign.sol/PSIPadCampaign.json'
import campaignFactoryAbi from '@passive-income/launchpad-contracts/abi/contracts/PSIPadCampaignFactory.sol/PSIPadCampaignFactory.json'
import tokenFactoryAbi from '@passive-income/launchpad-contracts/abi/contracts/PSIPadTokenDeployer.sol/PSIPadTokenDeployer.json'
import tokenLockFactoryAbi from '@passive-income/launchpad-contracts/abi/contracts/PSIPadTokenLockFactory.sol/PSIPadTokenLockFactory.json'

const getContract = (abi: any, address: string, web3?: Web3) => {
  const _web3 = web3 ?? web3NoAccount
  return new _web3.eth.Contract(abi as unknown as AbiItem, address)
}

export const getBep20Contract = (address: string, web3?: Web3) => {
  return getContract(bep20Abi, address, web3) as unknown as IBEP20
}

export const getPSIContact = (web3?: Web3) => {
  return getBep20Contract(getPSIAddress(), web3)
}

export const getCampaignContract = (address: string, web3?: Web3) => {
  return getContract(campaignAbi, address, web3) as unknown as PSIPadCampaign
}

export const getCampaignFactoryContract = (web3?: Web3) => {
  return getContract(campaignFactoryAbi, getCampaignFactoryAddress(), web3) as unknown as PSIPadCampaignFactory
}

export const getTokenFactoryContract = (web3?: Web3) => {
  return getContract(tokenFactoryAbi, getTokenFactoryAddress(), web3) as unknown as PSIPadTokenDeployer
}

export const getTokenLockFactoryContract = (web3?: Web3) => {
  return getContract(tokenLockFactoryAbi, getTokenLockFactoryAddress(), web3) as unknown as PSIPadTokenLockFactory
}
