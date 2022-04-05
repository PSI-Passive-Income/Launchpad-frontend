import { BigNumber, utils } from 'ethers'
import _, { isBoolean, isEmpty, isObject, isString } from 'lodash'

export const camelCaseKeys = (obj: any | any[]) => {
  if (!_.isObject(obj)) return obj
  if (_.isArray(obj)) return obj.map((v) => camelCaseKeys(v))
  return _.reduce(
    obj,
    (r, v, k) => {
      return {
        ...r,
        [_.camelCase(k)]: camelCaseKeys(v),
      }
    },
    {},
  )
}

export const snakeCaseKeys = (obj: any | any[]) => {
  if (!_.isObject(obj)) return obj
  if (_.isArray(obj)) return obj.map((v) => snakeCaseKeys(v))
  return _.reduce(
    obj,
    (r, v, k) => {
      return {
        ...r,
        [_.snakeCase(k)]: snakeCaseKeys(v),
      }
    },
    {},
  )
}

export const unixTSToDate = (value: string | number) => {
  const numberValue = parseFloat(value.toString())
  if (Number.isNaN(numberValue) || !Number.isFinite(numberValue)) return null
  return new Date(numberValue * 1000)
}

export const toBigNumber = (value: string | number | BigNumber, decimals = 18) => {
  try {
    if (isObject(value)) return value
    const stringValue = value?.toString()
    if (isEmpty(stringValue) || !isString(stringValue)) return null
    return utils.parseUnits(stringValue, decimals)
  } catch (err) {
    console.error(err)
    return null
  }
}

export const toBool = (value: string | number) => {
  return (isBoolean(value) && value) || (!!value && isString(value) && value?.toLowerCase() !== 'false')
}
