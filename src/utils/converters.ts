import BigNumber from 'bignumber.js'
import _, { isBoolean, isFinite, isNil, isString, toFinite } from 'lodash'

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
  console.log(value.toString(), numberValue)
  if (Number.isNaN(numberValue) || !Number.isFinite(numberValue)) return null
  return new Date(numberValue * 1000)
}

export const toBigNumber = (value: string | number) => {
  const stringValue = value?.toString()
  if (isNil(stringValue) || !isString(stringValue)) return null
  return new BigNumber(stringValue)
}

export const toBool = (value: string | number) => {
  return (isBoolean(value) && value) || (!!value && (isString(value) && value?.toLowerCase() !== 'false'))
}