import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import web3 from 'web3'
import {
  funcSuccess,
  funcValidationError,
  func404NotFound,
  func500Error,
  validateJWTWalletSign,
} from '@passive-income/psi-api'
import { initSequelize } from '../src/storage'
import Campaign from '../src/models/campaign.model'
import { isNumber } from 'lodash'

const httpTrigger: AzureFunction = async function httpTrigger(context: Context, req: HttpRequest): Promise<void> {
  try {
    await initSequelize()

    if (req.method === 'OPTIONS') funcSuccess(context)
    else if (req.method === 'GET') await get(context, req)
    else if (req.method === 'POST') await create(context, req)
  } catch (error) {
    console.error(error)
    func500Error(context, error)
  }
}

const get = async (context: Context, req: HttpRequest) => {
  if (context?.bindingData?.campaignId) {
    if (context?.bindingData?.campaignId === 'token') {
      if (context?.bindingData?.tokenAddress && web3.utils.isAddress(context.bindingData.tokenAddress)) {
        const campaign = await Campaign.findOne({
          where: { token_address: context.bindingData.tokenAddress.toLowerCase() },
        })
        return funcSuccess(context, campaign ? campaign.toJSON() : null)
      }
      return funcValidationError(context, 'Parameter tokenAddress not set or not an valid address')
    }

    let campaign
    if (web3.utils.isAddress(context.bindingData.campaignId)) {
      campaign = await Campaign.findOne({ where: { campaign_address: context.bindingData.campaignId.toLowerCase() } })
    } else if (isNumber(context.bindingData.campaignId)) {
      campaign = await Campaign.findByPk(context.bindingData.campaignId)
    } else {
      return funcValidationError(context, 'Parameter campaignId not an valid address')
    }
    if (!campaign) return func404NotFound(context)
    return funcSuccess(context, campaign ? campaign.toJSON() : null)
  }

  const campaigns = await Campaign.findAll()
  return funcSuccess(context, campaigns ? campaigns.map((c) => c.toJSON()) : [])
}

const create = async (context: Context, req: HttpRequest) => {
  const validationResult = await validateJWTWalletSign(context, req) // check if wallet is signed in
  if (validationResult) return validationResult

  if (!req?.body?.id) return funcValidationError(context, 'Post parameter id not set')
  if (!req?.body?.token_address || !web3.utils.isAddress(req.body.token_address))
    return funcValidationError(context, 'Post parameter token_address not set or not an valid address')
  if (!req?.body?.campaign_address || !web3.utils.isAddress(req.body.campaign_address))
    return funcValidationError(context, 'Post parameter campaign_address not set or not an valid address')
  if (!req?.body?.owner || !web3.utils.isAddress(req.body.owner))
    return funcValidationError(context, 'Post parameter owner not set or not an valid address')

  const campaign = await Campaign.create({
    id: req.body.id,
    token_name: req.body.token_name,
    token_address: req.body.token_address.toLowerCase(),
    campaign_address: req.body.campaign_address.toLowerCase(),
    description: req.body.desc,
    owner: req.body.owner.toLowerCase(),
  })

  return funcSuccess(context, campaign ? campaign.toJSON() : null)
}

export default httpTrigger