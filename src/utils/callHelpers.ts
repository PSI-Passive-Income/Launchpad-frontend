import { IBEP20 } from '@passive-income/launchpad-contracts/typechain-web3/IBEP20'
import { PSIPadCampaign } from '@passive-income/launchpad-contracts/typechain-web3/PSIPadCampaign'
import { PSIPadCampaignFactory } from '@passive-income/launchpad-contracts/typechain-web3/PSIPadCampaignFactory'
import { PSIPadTokenDeployer } from '@passive-income/launchpad-contracts/typechain-web3/PSIPadTokenDeployer'
import { PSIPadTokenLockFactory } from '@passive-income/launchpad-contracts/typechain-web3/PSIPadTokenLockFactory'
import { BaseContract } from '@passive-income/launchpad-contracts/typechain-web3/types'
import BigNumber from 'bignumber.js'
import { utils, constants, Contract } from 'ethers'
import { isNil, isObject, parseInt, round } from 'lodash'
import { Campaign, TokenCreationInfo, TokenLock } from 'state/types'

export const approve = async (
  contract: IBEP20,
  account: string,
  spender: string | Contract | BaseContract,
  amount?: utils.BigNumberish,
) => {
  const spenderAddress = isObject(spender) ? (spender as BaseContract).options.address : spender
  const finalAmount = !isNil(amount) ? amount.toString() : constants.MaxUint256.toString()
  return contract.methods.approve(spenderAddress, finalAmount).send({ from: account })
}

export const buyTokens = async (campaign: PSIPadCampaign, account: string, amount: utils.BigNumberish) => {
  return campaign.methods.buyTokens().send({ from: account, value: amount.toString() })
}

export const withdrawTokens = async (campaign: PSIPadCampaign, account: string) => {
  return campaign.methods.withdrawTokens().send({ from: account })
}

export const withdrawFunds = async (campaign: PSIPadCampaign, account: string) => {
  return campaign.methods.withdrawFunds().send({ from: account })
}

export const lockCampaign = async (
  campaignFactory: PSIPadCampaignFactory,
  account: string,
  campaignId: utils.BigNumberish,
) => {
  return campaignFactory.methods.lock(campaignId.toString()).send({ from: account })
}

export const unlockCampaign = async (
  campaignFactory: PSIPadCampaignFactory,
  account: string,
  campaignId: utils.BigNumberish,
) => {
  return campaignFactory.methods.unlock(campaignId.toString()).send({ from: account })
}

export const tokensNeeded = async (
  campaignFactory: PSIPadCampaignFactory,
  campaign: Partial<Campaign>,
  feePercentage = 0,
) => {
  const result = await campaignFactory.methods
    .tokensNeeded(
      [
        campaign.softCap.toString(),
        campaign.hardCap.toString(),
        round(campaign.startDate.getTime() / 1000),
        round(campaign.endDate.getTime() / 1000),
        campaign.rate.toString(),
        campaign.minAllowed.toString(),
        campaign.maxAllowed.toString(),
        campaign.poolRate.toString(),
        campaign.lockDuration.toString(),
        campaign.liquidityRate.toString(),
      ],
      feePercentage,
    )
    .call()
  return new BigNumber(result)
}

export const createCampaign = async (
  campaignFactory: PSIPadCampaignFactory,
  account: string,
  campaign: Partial<Campaign>,
  feePercentage = 0,
) => {
  return campaignFactory.methods
    .createCampaign(
      [
        campaign.softCap.toString(),
        campaign.hardCap.toString(),
        round(campaign.startDate.getTime() / 1000),
        round(campaign.endDate.getTime() / 1000),
        campaign.rate.toString(),
        campaign.minAllowed.toString(),
        campaign.maxAllowed.toString(),
        campaign.poolRate.toString(),
        campaign.lockDuration.toString(),
        campaign.liquidityRate.toString(),
      ],
      campaign.tokenAddress,
      feePercentage,
    )
    .send({ from: account })
}

export const getUserTokens = async (tokenFactory: PSIPadTokenDeployer, account: string) => {
  return tokenFactory.methods.getUserTokens(account).call()
}

export const createToken = async (tokenFactory: PSIPadTokenDeployer, account: string, token: Partial<TokenCreationInfo>) => {
  return tokenFactory.methods
    .createToken([
      token.name,
      token.symbol,
      token.initialSupply?.toString(),
      token.maximumSupply?.toString() ?? 0,
      token.burnable ?? false,
      token.mintable ?? false,
      token.minterDelay ?? 0,
      token.crossChain ?? false,
      constants.AddressZero,
      constants.AddressZero,
    ])
    .send({ from: account, value: utils.parseEther('0.2').toString() })
}

export const getUserCampaigns = async (campaignFactory: PSIPadCampaignFactory, account: string) => {
  const results = await campaignFactory.methods.getUserCampaigns(account).call()
  return results?.map((id) => parseInt(id))
}

export const getCampaignAddress = async (campaignFactory: PSIPadCampaignFactory, campaignId: number) => {
  return campaignFactory.methods.campaigns(campaignId).call()
}

export const getUserLocks = async (lockFactory: PSIPadTokenLockFactory, account: string) => {
  const results = await lockFactory.methods.getUserLocks(account).call()
  return results?.map((id) => parseInt(id))
}

export const getTokenLock = async (lockFactory: PSIPadTokenLockFactory, lockId: number) => {
  return lockFactory.methods.tokensLocked(lockId).call()
}

export const createTokenLock = async (
  lockFactory: PSIPadTokenLockFactory,
  account: string,
  lock: Partial<TokenLock>,
) => {
  return lockFactory.methods
    .lock(
      lock.token,
      lock.amount.toString(),
      round(lock.startTime.getTime() / 1000),
      round(lock.duration / 1000),
      lock.releases,
    )
    .send({ from: account, value: utils.parseEther('0.2').toString() })
}

export const unlockAvailableToken = async (lockFactory: PSIPadTokenLockFactory, account: string, lockId: number) => {
  return lockFactory.methods.unlockAvailable(lockId).send({ from: account })
}

export const unlockTokenAmount = async (
  lockFactory: PSIPadTokenLockFactory,
  account: string,
  lockId: number,
  amount: utils.BigNumberish,
) => {
  return lockFactory.methods.unlock(lockId, amount.toString()).send({ from: account })
}
