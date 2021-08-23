import { isNil, isNumber } from 'lodash'
import { utils } from 'ethers'
import BigNumber from 'bignumber.js'
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

export const formatDuration = (value: string | number, contractValue = false) => {
  const numberValue = parseFloat(value.toString())
  if (Number.isNaN(numberValue) || !Number.isFinite(numberValue)) return null
  return moment.duration(numberValue * (contractValue ? 1000 : 1)).format()
}

export const formatBN = (value: utils.BigNumberish | BigNumber, decimals = 18, toString = false) => {
  if (isNil(value)) return ""
  const bn = new BigNumber(value.toString())
  if (toString) return decimals > 0 ? bn.div(10 ** decimals).toString() : bn.toString()
  return decimals > 0 ? bn.div(10 ** decimals).toFormat() : bn.toFormat()
}