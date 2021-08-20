import BigNumber from 'bignumber.js'
import { isEmpty, isFinite, toFinite } from 'lodash'
import { isMoment } from 'moment'
import Web3 from 'web3'
import { toBool } from './converters'

const validate = <T>(
  initial: T,
  errors: { [key: string]: string },
  value: any,
  name: string,
  type: string,
  mandatory = true,
) => {
  const newErrors = { ...errors }
  delete newErrors[name]

  const newValue: Partial<T> = { ...initial }
  newValue[name] = value

  if (!isEmpty(value)) {
    if (type === 'boolean') {
      newValue[name] = toBool(value)
    } else if (type === 'BigNumber' || type === 'number') {
      if (!isFinite(value)) {
        newErrors[name] = 'Please fill in a correct number'
      }
      newValue[name] = type === 'BigNumber' ? new BigNumber(value) : toFinite(value)
    } else if (type === 'address') {
      if (!Web3.utils.isAddress(value)) {
        newErrors[name] = 'Please fill in a correct address'
      }
      newValue[name] = value
    } else if (type === 'date') {
      if (isMoment(value)) {
        newValue[name] = value.toDate()
      } else {
        newErrors[name] = 'Please use a correct format'
      }
    } else {
      newValue[name] = value
    }
  } else if (mandatory) {
    newErrors[name] = 'This field is required'
  }

  return { newValue, newErrors }
}

export default validate
