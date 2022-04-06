import PSIPadCampaignAbi from 'config/abi/PSIPadCampaign.json'
import { toFinite } from 'lodash'
import { Campaign, CampaignStatus } from 'state/types'
import { toBigNumber, toBool, unixTSToDate } from 'utils/converters'
import { nestedMulticall, Call, multicall } from 'utils/multicall'

export const fetchCampaignsLiveData = async (campaigns: Campaign[], connectedWallet?: string) => {
  if (!campaigns) return

  const calls: Call[][] = campaigns.map((campaign) => {
    const campaignCalls: Call[] = []
    campaignCalls.push({ address: campaign.campaignAddress, name: 'softCap' })
    campaignCalls.push({ address: campaign.campaignAddress, name: 'hardCap' })
    campaignCalls.push({ address: campaign.campaignAddress, name: 'start_date' })
    campaignCalls.push({ address: campaign.campaignAddress, name: 'end_date' })
    campaignCalls.push({ address: campaign.campaignAddress, name: 'lock_duration' })
    campaignCalls.push({ address: campaign.campaignAddress, name: 'getRemaining' })
    campaignCalls.push({ address: campaign.campaignAddress, name: 'isLive' })
    campaignCalls.push({ address: campaign.campaignAddress, name: 'finalized' })
    campaignCalls.push({ address: campaign.campaignAddress, name: 'failed' })
    if (connectedWallet) {
      campaignCalls.push({ address: campaign.campaignAddress, name: 'getGivenAmount', params: [connectedWallet] })
    }
    return campaignCalls
  })

  const liveData = await nestedMulticall(PSIPadCampaignAbi, calls)

  liveData.forEach((callData, idx) => {
    const campaign = campaigns[idx]
    campaign.softCap = toBigNumber(callData[0])
    campaign.hardCap = toBigNumber(callData[1])
    campaign.startDate = unixTSToDate(callData[2])
    campaign.endDate = unixTSToDate(callData[3])
    campaign.lockDuration = toFinite(callData[4])
    campaign.remaining = toBigNumber(callData[5])
    if (callData[6]) campaign.status = CampaignStatus.Live
    else if (callData[8]) campaign.status = CampaignStatus.Failed
    else if (callData[7] || Date.now() >= campaign.endDate.getTime()) campaign.status = CampaignStatus.Ended
    else campaign.status = CampaignStatus.NotStarted
    campaign.userContributed = toBigNumber(0)
    if (connectedWallet) {
      campaign.userContributed = toBigNumber(callData[9])
    }
  })
}

export const fetchDetailedData = async (campaign: Campaign, connectedWallet: string): Promise<Campaign> => {
  if (!campaign) return campaign

  const chainId = parseInt(process.env.REACT_APP_CHAIN_ID)
  const withWhitelist = !((chainId === 97 && campaign?.id < 21) || (chainId === 56 && campaign?.id < 1))

  const calls: Call[] = []
  calls.push({ address: campaign.campaignAddress, name: 'softCap' })
  calls.push({ address: campaign.campaignAddress, name: 'hardCap' })
  calls.push({ address: campaign.campaignAddress, name: 'start_date' })
  calls.push({ address: campaign.campaignAddress, name: 'end_date' })
  calls.push({ address: campaign.campaignAddress, name: 'rate' })
  calls.push({ address: campaign.campaignAddress, name: 'min_allowed' })
  calls.push({ address: campaign.campaignAddress, name: 'max_allowed' })
  calls.push({ address: campaign.campaignAddress, name: 'pool_rate' })
  calls.push({ address: campaign.campaignAddress, name: 'lock_duration' })
  calls.push({ address: campaign.campaignAddress, name: 'liquidity_rate' })
  calls.push({ address: campaign.campaignAddress, name: 'campaignTokens' })
  calls.push({ address: campaign.campaignAddress, name: 'collected' })
  calls.push({ address: campaign.campaignAddress, name: 'getRemaining' })
  calls.push({ address: campaign.campaignAddress, name: 'isLive' })
  calls.push({ address: campaign.campaignAddress, name: 'finalized' })
  calls.push({ address: campaign.campaignAddress, name: 'failed' })
  calls.push({ address: campaign.campaignAddress, name: 'locked' })
  calls.push({ address: campaign.campaignAddress, name: 'unlock_date' })
  if (connectedWallet) {
    calls.push({ address: campaign.campaignAddress, name: 'getGivenAmount', params: [connectedWallet] })
  }
  if (withWhitelist) {
    calls.push({ address: campaign.campaignAddress, name: 'whitelistEnabled' })
    if (connectedWallet)
      calls.push({ address: campaign.campaignAddress, name: 'whitelisted', params: [connectedWallet] })
  }

  const tokenData = await multicall(PSIPadCampaignAbi, calls)
  const liveCampaign = {
    ...campaign,
    ...{
      softCap: toBigNumber(tokenData[0]),
      hardCap: toBigNumber(tokenData[1]),
      startDate: unixTSToDate(tokenData[2]),
      endDate: unixTSToDate(tokenData[3]),
      rate: toBigNumber(tokenData[4]),
      minAllowed: toBigNumber(tokenData[5]),
      maxAllowed: toBigNumber(tokenData[6]),
      poolRate: toBigNumber(tokenData[7]),
      lockDuration: toFinite(tokenData[8]),
      liquidityRate: toFinite(tokenData[9]),
      campaignTokens: toBigNumber(tokenData[10]),
      collected: toBigNumber(tokenData[11]),
      remaining: toBigNumber(tokenData[12]),
      locked: toBool(tokenData[16]),
      unlockDate: unixTSToDate(tokenData[17]),
      whitelistEnabled: withWhitelist ? tokenData[19] : false,
    },
  }
  if (tokenData[13]) liveCampaign.status = CampaignStatus.Live
  else if (tokenData[15]) liveCampaign.status = CampaignStatus.Failed
  else if (tokenData[14] || Date.now() >= liveCampaign.endDate.getTime()) liveCampaign.status = CampaignStatus.Ended
  else liveCampaign.status = CampaignStatus.NotStarted
  liveCampaign.userContributed = toBigNumber(0)
  if (connectedWallet) {
    liveCampaign.userContributed = toBigNumber(tokenData[18])
    liveCampaign.userWhitelisted = withWhitelist ? tokenData[20] : false
  }
  return liveCampaign
}
