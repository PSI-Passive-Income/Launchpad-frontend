import { isNil, isNumber } from 'lodash'
import { utils } from 'ethers'
import BigNumber from 'bignumber.js'

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

export const formatBN = (value: utils.BigNumberish | BigNumber, decimals = 18) => {
  if (isNil(value)) return ""
  const bn = new BigNumber(value.toString())
  return decimals > 0 ? bn.div(10 ** decimals).toString() : bn.toString()
}