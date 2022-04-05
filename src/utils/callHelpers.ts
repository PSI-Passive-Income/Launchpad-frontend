import { Dispatch } from 'react'
import { IBEP20 } from 'config/types/IBEP20'
import { PSIPadCampaign } from 'config/types/PSIPadCampaign'
import { PSIPadCampaignFactory } from 'config/types/PSIPadCampaignFactory'
import { PSIPadTokenDeployer } from 'config/types/PSIPadTokenDeployer'
import { PSIPadTokenLockFactory } from 'config/types/PSIPadTokenLockFactory'
import { Contract, ContractTransaction, ContractReceipt } from '@ethersproject/contracts'
import { getAddress } from '@ethersproject/address'
import { BigNumberish } from '@ethersproject/bignumber'
import { AddressZero, MaxUint256 } from '@ethersproject/constants'
import { parseEther } from '@ethersproject/units'
import { isNil, isObject, round } from 'lodash'
import { Campaign, TokenCreationInfo, TokenLock } from 'state/types'
import { toastError } from 'state/toasts'
import { solidityPack } from 'ethers/lib/utils'
import { getPSFactoryAddress, getPSRouterAddress } from './addressHelpers'

export const handleTransactionCall = async (call: () => Promise<ContractTransaction>, dispatch?: Dispatch<any>) => {
  try {
    const transaction = await call()
    return handleTransaction(transaction, dispatch)
  } catch (err: any) {
    const message = err?.data?.message ?? err?.message ?? 'Check your console for more information'
    dispatch(toastError('Error processing transaction', message))
    return false
  }
}

export const handleTransaction = async (transaction: ContractTransaction, dispatch?: Dispatch<any>) => {
  const receipt = await transaction.wait()
  if (dispatch) handleReceipt(receipt, dispatch)
  return receipt.status > 0
}

export const handleReceipt = (receipt: ContractReceipt, dispatch: Dispatch<any>) => {
  if (receipt.status === 0) {
    dispatch(toastError('Error processing transaction', 'Check your console for more information'))
    console.error('Error processing transaction', receipt)
  }
  return receipt.status > 0
}

export const approve = async (contract: IBEP20, account: string, spender: string | Contract, amount?: BigNumberish) => {
  const spenderAddress = isObject(spender) ? spender.address : spender
  const finalAmount = !isNil(amount) ? amount.toString() : MaxUint256.toString()
  return contract.approve(spenderAddress, finalAmount, { from: account })
}

export const setWhitelistEnabled = async (campaign: PSIPadCampaign, value: boolean) => {
  return campaign.setWhitelistEnabled(value)
}

export const setWhitelist = async (campaign: PSIPadCampaign, addresses: string[], whitelisted: boolean) => {
  const finalAddresses = addresses.map((address) => {
    try {
      return getAddress(address)
    } catch (err) {
      throw new Error(`Invalid address: ${address}`)
    }
  })
  const data = `0x${finalAddresses?.map((address) => solidityPack(['address'], [address]).substr(2)).join('')}`
  return campaign.addWhitelist(data, whitelisted)
}

export const buyTokens = async (campaign: PSIPadCampaign, account: string, amount: BigNumberish) => {
  return campaign.buyTokens({ from: account, value: amount.toString() })
}

export const withdrawTokens = async (campaign: PSIPadCampaign, account: string) => {
  return campaign.withdrawTokens({ from: account })
}

export const withdrawFunds = async (campaign: PSIPadCampaign, account: string) => {
  return campaign.withdrawFunds({ from: account })
}

export const lockCampaign = async (
  campaignFactory: PSIPadCampaignFactory,
  account: string,
  campaignId: BigNumberish,
) => {
  return campaignFactory.lock(campaignId.toString(), { from: account })
}

export const unlockCampaign = async (
  campaignFactory: PSIPadCampaignFactory,
  account: string,
  campaignId: BigNumberish,
) => {
  return campaignFactory.unlock(campaignId.toString(), { from: account })
}

export const tokensNeeded = async (
  campaignFactory: PSIPadCampaignFactory,
  campaign: Partial<Campaign>,
  feePercentage = 0,
) => {
  const result = await campaignFactory.tokensNeeded(
    {
      softCap: campaign.softCap?.toString() ?? 0,
      hardCap: campaign.hardCap.toString(),
      start_date: round((campaign.startDate?.getTime() ?? 0) / 1000),
      end_date: round((campaign.endDate?.getTime() ?? 0) / 1000),
      rate: campaign.rate.toString(),
      min_allowed: campaign.minAllowed?.toString() ?? 0,
      max_allowed: campaign.maxAllowed?.toString() ?? 0,
      pool_rate: campaign.poolRate.toString(),
      lock_duration: campaign.lockDuration?.toString() ?? 0,
      liquidity_rate: campaign.liquidityRate.toString(),
      whitelist_enabled: !!campaign.whitelistEnabled,
    },
    feePercentage,
  )
  return result
}

export const createCampaign = async (
  campaignFactory: PSIPadCampaignFactory,
  account: string,
  campaign: Partial<Campaign>,
  feePercentage = 0,
) => {
  return campaignFactory.createCampaign(
    {
      softCap: campaign.softCap?.toString() ?? 0,
      hardCap: campaign.hardCap.toString(),
      start_date: round((campaign.startDate?.getTime() ?? 0) / 1000),
      end_date: round((campaign.endDate?.getTime() ?? 0) / 1000),
      rate: campaign.rate.toString(),
      min_allowed: campaign.minAllowed?.toString() ?? 0,
      max_allowed: campaign.maxAllowed?.toString() ?? 0,
      pool_rate: campaign.poolRate.toString(),
      lock_duration: campaign.lockDuration?.toString() ?? 0,
      liquidity_rate: campaign.liquidityRate.toString(),
      whitelist_enabled: !!campaign.whitelistEnabled,
    },
    campaign.tokenAddress,
    feePercentage,
    getPSFactoryAddress(),
    getPSRouterAddress(),
    { from: account },
  )
}

export const getUserTokens = async (tokenFactory: PSIPadTokenDeployer, account: string) => {
  return tokenFactory.getUserTokens(account)
}

export const createToken = async (
  tokenFactory: PSIPadTokenDeployer,
  account: string,
  token: Partial<TokenCreationInfo>,
) => {
  return tokenFactory.createToken(
    {
      name: token.name,
      symbol: token.symbol,
      initialSupply: token.initialSupply?.toString(),
      maximumSupply: token.maximumSupply?.toString() ?? 0,
      burnable: token.burnable ?? false,
      mintable: token.mintable ?? false,
      minterDelay: token.minterDelay ?? 0,
      crossChain: token.crossChain ?? false,
      underlying: AddressZero,
      vault: AddressZero,
    },
    { from: account, value: parseEther('0.2').toString() },
  )
}

export const getUserCampaigns = async (campaignFactory: PSIPadCampaignFactory, account: string) => {
  const results = await campaignFactory.getUserCampaigns(account)
  return results?.map((id) => id.toNumber())
}

export const getCampaignAddress = async (campaignFactory: PSIPadCampaignFactory, campaignId: number) => {
  return campaignFactory.campaigns(campaignId)
}

export const getUserLocks = async (lockFactory: PSIPadTokenLockFactory, account: string) => {
  const results = await lockFactory.getUserLocks(account)
  return results?.map((id) => id.toNumber())
}

export const getTokenLock = async (lockFactory: PSIPadTokenLockFactory, lockId: number) => {
  return lockFactory.tokensLocked(lockId)
}

export const createTokenLock = async (
  lockFactory: PSIPadTokenLockFactory,
  account: string,
  lock: Partial<TokenLock>,
) => {
  return lockFactory.lock(
    lock.token,
    lock.amount.toString(),
    round(lock.startTime.getTime() / 1000),
    round(lock.duration / 1000),
    lock.releases,
    { from: account, value: parseEther('0.2').toString() },
  )
}

export const unlockAvailableToken = async (lockFactory: PSIPadTokenLockFactory, account: string, lockId: number) => {
  return lockFactory.unlockAvailable(lockId, { from: account })
}

export const unlockTokenAmount = async (
  lockFactory: PSIPadTokenLockFactory,
  account: string,
  lockId: number,
  amount: BigNumberish,
) => {
  return lockFactory.unlock(lockId, amount.toString(), { from: account })
}
