import { LAUNCHPAD_API_URL } from "config/constants/misc"
import { Campaign,KYCuser } from "state/types"
import { camelCaseKeys } from "./converters"

export const fetchCampaignsData = async (): Promise<Campaign[]> => {
  const response = await fetch(`${LAUNCHPAD_API_URL}/campaigns`)
  if (!response.ok) throw new Error(await response.text())
  return camelCaseKeys(await response.json())
}

export const fetchCampaignData = async (id: string | number): Promise<Campaign> => {
  const response = await fetch(`${LAUNCHPAD_API_URL}/campaigns/${id}`)
  if (!response.ok) throw new Error(await response.text())
  return camelCaseKeys(await response.json())
}

export const fetchCampaignByToken = async (address: string): Promise<Campaign> => {
  const response = await fetch(`${LAUNCHPAD_API_URL}/campaigns/token/${address}`)
  if (!response.ok) throw new Error(await response.text())
  return camelCaseKeys(await response.json())
}

export const addCampaign = async (accessToken: string, campaign: Partial<Campaign>): Promise<Campaign> => {
  const response = await fetch(`${LAUNCHPAD_API_URL}/campaigns`, {
    body: JSON.stringify({
      id: campaign.id,
      token_name: campaign.tokenName,
      token_address: campaign.tokenAddress.toLowerCase(),
      campaign_address: campaign.campaignAddress.toLowerCase(),
      description: campaign.description,
      owner: campaign.owner,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Func-Authorization': `Bearer ${accessToken}`,
    },
    method: 'POST',
  })
  if (!response.ok) throw new Error(await response.text())
  return camelCaseKeys(await response.json())
}

// KYC Verification
export const setkycUserVerification = async (address: string, key: string): Promise<KYCuser> => {
  const response = await fetch(`${LAUNCHPAD_API_URL}/KYC`, {
    method: 'POST',
    body: JSON.stringify({
      user_address: address.toLowerCase(),
      user_key: key,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  
  })
  console.log(await response.json());
  
  if (!response.ok) throw new Error(await response.text())
  return camelCaseKeys(await response.json())
}
export const getKYCuserVerifcation = async (address: string): Promise<boolean> => {
  try {
    const response = await fetch(`${LAUNCHPAD_API_URL}/kyc/${address}`)
    if (!response.ok) throw new Error(await response.text())
    const result = await response.json();
  } catch (e) {
    return false
  }
  return true
}