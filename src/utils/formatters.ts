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

export const formatDurationUntil = (value: string | number, unix = true) => {
  if (isUndefined(value)) return null
  const numberValue = parseFloat(value.toString())
  if (Number.isNaN(numberValue) || !Number.isFinite(numberValue)) return null
  const momentValue = unix ? moment.unix(numberValue) : moment(numberValue)
  const duration = moment.duration(momentValue.diff(moment()))
  if (duration.years() >= 1) return 'More than a year'
  if (duration.months() > 1) return `In ${duration.months()} months`
  if (duration.months() === 1) return `In a month`
  if (duration.weeks() > 1) return `In ${duration.months()} weeks`
  if (duration.weeks() === 1) return `In a week`
  if (duration.days() > 1) return `In ${duration.months()} days`
  if (duration.days() === 1) return `In a day`
  return duration.format()
}

export const formatDuration = (value: string | number, unix = true) => {
  const numberValue = parseFloat(value.toString())
  if (Number.isNaN(numberValue) || !Number.isFinite(numberValue)) return null
  return moment.duration(numberValue * (unix ? 1000 : 1)).format()
}

export const formatBN = (value: BigNumberish | BigNumber, decimals = 18, toString = false) => {
  if (isNil(value)) return ''
  const bn = !isObject(value) ? BigNumber.from(value.toString()) : (value as BigNumber)
  if (toString) return decimals > 0 ? bn.div(10 ** decimals).toString() : bn.toString()
  return utils.formatUnits(bn, decimals ?? 0)
}

export const formatBool = (value: boolean) => {
  return value ? 'Yes' : 'No'
}
