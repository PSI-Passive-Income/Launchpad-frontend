import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import {
  funcSuccess,
  funcValidationError,
  func404NotFound,
  func500Error,
  validateJWTWalletSign,
} from '@passive-income/psi-api'
import Kyc from '../src/models/kyc.model'
import { initSequelize } from '../src/storage'
import web3 from 'web3'

const httpTrigger: AzureFunction = async function httpTrigger(context: Context, req: HttpRequest): Promise<void> {

  try {
    await initSequelize()

    if (req.method === 'OPTIONS') funcSuccess(context)
    else if (req.method === 'GET') await get(context, req)
    else if (req.method === 'POST') await create(context, req)

  } catch (error) {
    func500Error(context, error)
  }
};

const get = async (context: Context, req: HttpRequest) => {

  if (context?.bindingData?.address) {
    if (context?.bindingData?.address && web3.utils.isAddress(context.bindingData.address)) {

      const user = await Kyc.findOne({
        where: { user_address: context?.bindingData?.address.toLowerCase() },
      })
      return funcSuccess(context, user ? user.toJSON() : null)
    }
    return funcValidationError(context, 'Parameter not an valid address')
  }

  // const users = await Kyc.findAll();
  // console.log('user', users);

  // return funcSuccess(context, users ? users.map((u) => u.toJSON()) : [])
}

const create = async (context: Context, req: HttpRequest) => {

  if (!req?.body?.user_address || !web3.utils.isAddress(req.body.user_address))
    return funcValidationError(context, 'Post parameter not an valid address')
  if (!req?.body?.user_key)
    return funcValidationError(context, 'Post parameter KYC key not generated please try again')

  const user = await Kyc.create({
    user_address: req.body.user_address.toLowerCase(),
    KYC_key: req.body.user_key,
  })
  return funcSuccess(context, user ? user.toJSON() : null)
}
export default httpTrigger;