import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import web3 from 'web3'
import { funcSuccess, funcValidationError, func500Error, validateJWTWalletSign } from '@passive-income/psi-api'
import { initSequelize } from '../src/storage'
import Token from '../src/models/token.model'

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
  if (!context?.bindingData?.namesym) return funcValidationError(context, 'Post parameter namesym not set')

  const a = context.bindingData.namesym.split('_')
  console.log(a)
  const sameName = await Token.findOne({ where: { token_name: a[0] } })
  const sameSymbol = await Token.findOne({ where: { token_symbol: a[1] } })
  console.log(sameName, sameSymbol)

  if (sameName === null && sameSymbol === null) {
    return funcSuccess(context, { isUnique: true })
  }
  return funcSuccess(context, { isUnique: false })
}

const create = async (context: Context, req: HttpRequest) => {
  const validationResult = await validateJWTWalletSign(context, req) // check if wallet is signed in
  if (validationResult) return validationResult

  if (!req?.body?.token_address || !web3.utils.isAddress(req.body.token_address))
    return funcValidationError(context, 'Post parameter campaign_address not set or not an valid address')

  const token = await Token.create({
    token_name: req.body.token_name,
    token_symbol: req.body.token_symbol,
    token_address: req.body.token_address,
    maxSupply: req.body.maxSupply,
    initialSupply: req.body.initialSupply,
    mintable: req.body.mintable,
    burnable: req.body.burnable,
  })

  return funcSuccess(context, token ? token.toJSON() : null)
}

export default httpTrigger
