import PSIPadCampaignAbi from '@passive-income/launchpad-contracts/abi/contracts/PSIPadCampaign.sol/PSIPadCampaign.json'
import { toFinite } from 'lodash'
import { Campaign, CampaignStatus } from 'state/types'
import { toBigNumber, toBool, unixTSToDate } from 'utils/converters'
import { nestedMulticall, Call, multicall } from 'utils/multicall'

export const fetchCampaignsStatus = async (campaigns: Campaign[]) => {
  if (!campaigns) return

  const calls: Call[][] = campaigns.map((campaign) => {
    const campaignCalls: Call[] = []
    campaignCalls.push({ address: campaign.campaignAddress, name: 'start_date' })
    campaignCalls.push({ address: campaign.campaignAddress, name: 'end_date' })
    campaignCalls.push({ address: campaign.campaignAddress, name: 'getRemaining' })
    campaignCalls.push({ address: campaign.campaignAddress, name: 'isLive' })
    campaignCalls.push({ address: campaign.campaignAddress, name: 'finalized' })
    campaignCalls.push({ address: campaign.campaignAddress, name: 'failed' })
    return campaignCalls
  })

  const liveData = await nestedMulticall(PSIPadCampaignAbi, calls)

  liveData.forEach((callData, idx) => {
    const campaign = campaigns[idx]
    campaign.startDate = unixTSToDate(callData[1])
    campaign.endDate = unixTSToDate(callData[2])
    campaign.remaining = toBigNumber(callData[3])
    if (callData[4]) campaign.status = CampaignStatus.Live
    else if (callData[5]) campaign.status = CampaignStatus.Ended
    else if (callData[6]) campaign.status = CampaignStatus.Failed
    else campaign.status = CampaignStatus.NotStarted
  })
}

export const fetchCampaignsUserData = async (campaigns: Campaign[], connectedWallet: string) => {
  if (!campaigns || !connectedWallet) return

  const calls: Call[] = campaigns.map((campaign) => ({
    address: campaign.campaignAddress,
    name: 'getGivenAmount',
    params: [connectedWallet],
  }))
  const userData = await multicall(PSIPadCampaignAbi, calls)

  userData.forEach((callData, idx) => {
    const campaign = campaigns[idx]
    campaign.userContributed = toBigNumber(callData)
  })
}

export const fetchDetailedData = async (campaign: Campaign, connectedWallet: string): Promise<Campaign> => {
  if (!campaign) return campaign

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
      unlockData: unixTSToDate(tokenData[17]),
      userContributed: toBigNumber(tokenData[18]),
    },
  }
  if (tokenData[13]) liveCampaign.status = CampaignStatus.Live
  else if (tokenData[14]) liveCampaign.status = CampaignStatus.Ended
  else if (tokenData[15]) liveCampaign.status = CampaignStatus.Failed
  else liveCampaign.status = CampaignStatus.NotStarted

  return liveCampaign
}
