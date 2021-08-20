import BigNumber from 'bignumber.js'
import _, { isFinite, isNil, isString, toFinite } from 'lodash'

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
  if (isNil(value) || !isFinite(value)) return null
  return new Date(toFinite(value) * 1000)
}

export const toBigNumber = (value: string | number) => {
  if (isNil(value) || (!isString(value) && !isFinite(value))) return null
  return new BigNumber(value)
}

export const toBool = (value: string | number) => {
  return !!value && (isString(value) && value?.toLowerCase() !== 'false')
}