import { PSI_API_URL } from 'config/constants/misc'
import { Campaign, commentData, KYCuser, loginDataInfo, signUpDataInfo } from 'state/types'
import { camelCaseKeys } from './converters'

export const fetchCampaignsData = async (): Promise<Campaign[]> => {
  const response = await fetch(`${PSI_API_URL}/pad-campaigns`)
  if (!response.ok) throw new Error(await response.text())
  return camelCaseKeys(await response.json())
}

export const fetchCampaignData = async (id: string | number): Promise<Campaign> => {
  const response = await fetch(`${PSI_API_URL}/pad-campaigns/${id}`)
  if (!response.ok) throw new Error(await response.text())
  return camelCaseKeys(await response.json())
}

export const fetchCampaignByToken = async (address: string): Promise<Campaign> => {
  const response = await fetch(`${PSI_API_URL}/pad-campaigns/token/${address}`)
  if (!response.ok) throw new Error(await response.text())
  return camelCaseKeys(await response.json())
}

export const addCampaign = async (accessToken: string, campaign: Partial<Campaign>): Promise<Campaign> => {
  const response = await fetch(`${PSI_API_URL}/pad-campaigns`, {
    body: JSON.stringify({
      id: campaign.id,
      token_name: campaign.tokenName,
      token_address: campaign.tokenAddress.toLowerCase(),
      campaign_address: campaign.campaignAddress.toLowerCase(),
      description: campaign.description,
      owner: campaign.owner,
      kyc_Verified: campaign.kycVerified,
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

export const updateCampaignKyc = async (accessToken: string, kyc: boolean, account: string): Promise<void> => {
  try {
    const response = await fetch(`${PSI_API_URL}/pad-campaigns/kyc`, {
      method: 'PUT',
      body: JSON.stringify({
        user_address: account,
        kyc_verified: kyc,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Func-Authorization': `Bearer ${accessToken}`,
      },
    })
    if (!response.ok) throw new Error(await response.text())
  } catch (err) {
    console.error(err)
  }
}

// export const uploadCampaignFile = async (campaignAddress: any, file: FormData): Promise<void> => {

//   console.log("file", file)
//   const response = await fetch(`${PSI_API_URL}/pad-campaigns/`, {
//     method: 'PUT',
//     body: file,
//     headers: {
//       Accept: 'application/json',
//       "Content-Type": "multipart/form-data",
//     },
//   })
//   if (!response.ok) throw new Error(await response.text())
//   // return camelCaseKeys(await response.json())
// }
// KYC Verification
export const setkycUserVerification = async (address: string, key: string): Promise<boolean> => {
  try {
    const response = await fetch(`${PSI_API_URL}/KYC`, {
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
    if (!response.ok) throw new Error(await response.text())
    await response.json()
  } catch (err) {
    return false
  }
  return true
}

export const fileUpload = async (data: {
  campaignAddress: any
  userAddress?: string
  file?: FormData
}): Promise<KYCuser> => {
  const response = await fetch(`${PSI_API_URL}/KYC`, {
    method: 'POST',
    body: JSON.stringify({
      user_address: data.userAddress.toLowerCase(),
      campaign_address: data.campaignAddress.toLowerCase(),
      file_name: data.file,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) throw new Error(await response.text())
  return camelCaseKeys(await response.json())
}

export const getKYCuserVerifcation = async (address: string): Promise<boolean> => {
  try {
    const response = await fetch(`${PSI_API_URL}/kyc/${address}`)
    if (!response.ok) throw new Error(await response.text())
    await response.json()
  } catch (err) {
    return false
  }
  return true
}

// Email
export const apiSignUp = async (data: Partial<signUpDataInfo>): Promise<signUpDataInfo> => {
  const response = await fetch(`${PSI_API_URL}/userEmail`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) throw new Error(await response.text())
  return camelCaseKeys(await response.json())
}
export const apiIsExist = async (data: Partial<signUpDataInfo>): Promise<signUpDataInfo> => {
  try {
    const response = await fetch(`${PSI_API_URL}/userEmail/isUser`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    })
    if (!response.ok) throw new Error(await response.text())
    return camelCaseKeys(await response.json())
  } catch (err) {
    return null
  }
}

export const apiLogIn = async (data: Partial<loginDataInfo>): Promise<loginDataInfo> => {
  const response = await fetch(`${PSI_API_URL}/userEmail/logIn`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  })
  if (!response.ok) throw new Error(await response.text())
  return camelCaseKeys(await response.json())
}

// Comment
export const createComment = async (data: Partial<commentData>): Promise<commentData> => {
  const response = await fetch(`${PSI_API_URL}/pad-comments`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  })
  if (!response.ok) throw new Error(await response.text())
  return camelCaseKeys(await response.json())
}

export const fetchComments = async (CampaignAddress: string): Promise<Partial<commentData[]>> => {
  const response = await fetch(`${PSI_API_URL}/pad-comments/${CampaignAddress}`)
  if (!response.ok) throw new Error(await response.text())
  return camelCaseKeys(await response.json())
}

export const updateComment = async (
  object: { id: number; comment: string },
  campaignId: string,
): Promise<commentData> => {
  const response = await fetch(`${PSI_API_URL}/pad-comments/${campaignId}`, {
    method: 'PUT',
    body: JSON.stringify(object),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  })
  if (!response.ok) throw new Error(await response.text())
  return camelCaseKeys(await response.json())
}

export const deleteCommentApi = async (campaignId: string, id: number): Promise<boolean> => {
  const response = await fetch(`${PSI_API_URL}/pad-comments/${campaignId}`, {
    method: 'DELETE',
    body: JSON.stringify(id),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  })
  if (response.ok) return true
  return false
}
