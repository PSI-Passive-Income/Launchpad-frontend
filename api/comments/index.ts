import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import web3 from 'web3';
import {
  funcSuccess,
  funcValidationError,
  func500Error,
  validateJWTWalletSign,
} from '@passive-income/psi-api'
import { initSequelize } from '../src/storage'
import Comment from '../src/models/comment.model'

const httpTrigger: AzureFunction = async function httpTrigger(context: Context, req: HttpRequest): Promise<void> {
  try {
    await initSequelize()

    if (req.method === 'GET') await get(context, req)
    else if (req.method === 'POST') await create(context, req)
  } catch (error) {
    console.error(error)
    func500Error(context, error)
  }
}

const get = async (context: Context, req: HttpRequest) => {
  if (context?.bindingData?.campaign_address) {
    if (web3.utils.isAddress(context.bindingData.campaign_address)) {
      const comments = await Comment.findAll({ where: { campaign_address: context.bindingData.campaignAddress.toLowerCase() }})
      return funcSuccess(context, comments ? comments.map(c => c.toJSON()) : [])
    }
    return funcValidationError(context, 'Post parameter campaign_address not set or not an valid address')
  }

  const comments = await Comment.findAll()
  return funcSuccess(context, comments ? comments.map(c => c.toJSON()) : [])
}

const create = async (context: Context, req: HttpRequest) => {
  const validationResult = await validateJWTWalletSign(context, req) // check if wallet is signed in
  if (validationResult) return validationResult;

  if (req?.body?.campaign_address && !web3.utils.isAddress(req.body.campaign_address))
    return funcValidationError(context, 'Post parameter campaign_address not an valid address')

  const comment = await Comment.create({
    userId: (req as any).user?.payload?.id, // is set after validate
    message: req.body.comment,
    campaign_address: req.body.campaign_address.toLowerCase(),
  });

  return funcSuccess(context, comment ? comment.toJSON() : null)
}

export default httpTrigger
