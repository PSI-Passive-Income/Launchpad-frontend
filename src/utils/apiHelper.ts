import { LAUNCHPAD_API_URL } from "config/constants/misc"
import { Campaign } from "state/types"
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
    body: JSON.stringify(campaign),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Func-Authorization': `Bearer ${accessToken}`,
    },
    method: 'POST',
  })
  if (!response.ok) throw new Error(await response.text())
  return response.json()
}