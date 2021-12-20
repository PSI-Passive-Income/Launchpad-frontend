import { isNil, isNumber, isObject, isUndefined } from 'lodash'
import { utils, BigNumberish, BigNumber } from 'ethers'
import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'

momentDurationFormatSetup(moment as any)

type dateTimeFormats = 'long' | 'short' | 'full' | 'medium'

export const formatDate = (date: Date | number, dateStyle: dateTimeFormats = 'long') => {
  const _date = isNumber(date) ? new Date(date) : date
  return new Intl.DateTimeFormat('en-GB', { dateStyle }).format(_date)
}

export const formatDateTime = (
  date: Date | number,
  dateStyle: dateTimeFormats = 'long',
  timeStyle: dateTimeFormats = 'long',
) => {
  const _date = isNumber(date) ? new Date(date) : date
  return new Intl.DateTimeFormat('en-GB', { dateStyle, timeStyle }).format(_date)
}

export const formateDurationUntil = (value: string | number, unix = true) => {
  if (isUndefined(value)) return null;
  const numberValue = parseFloat(value.toString())
  if (Number.isNaN(numberValue) || !Number.isFinite(numberValue)) return null
  const momentValue = unix ? moment.unix(numberValue) : moment(numberValue)
  return moment.duration(momentValue.diff(moment())).format()
}

export const formatDuration = (value: string | number, unix = true) => {
  if (isUndefined(value)) return null;
  const numberValue = parseFloat(value.toString())
  if (Number.isNaN(numberValue) || !Number.isFinite(numberValue)) return null
  return moment.duration(numberValue * (unix ? 1000 : 1)).format()
}

export const formatBN = (value: BigNumberish | BigNumber, decimals = 18) => {
  if (isUndefined(value) || isNil(value)) return ""
  const bn = !isObject(value) ? BigNumber.from(value.toString()) : value as BigNumber
  return utils.formatUnits(bn, decimals ?? 0)
}

export const formatBool = (value: boolean) => {
  return (value) ? "Yes" : "No"
}

export const formatMetadataUri = (value: string) => {
  if (!value || !value?.toLowerCase().startsWith("ipfs:/")) return value
  const slashIdx = value.indexOf("://") !== -1 ? value.indexOf("://") + 3 : value.indexOf(":/") + 2
  return `https://ipfs.infura.io/ipfs/${value.substring(slashIdx)}`
}