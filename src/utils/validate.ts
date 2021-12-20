import { isEmpty } from 'lodash'
import { parseUnits } from '@ethersproject/units'
import { isMoment } from 'moment'
import Web3 from 'web3'
import { toBool } from './converters'

export const validateSingle = <T>(
  value: any,
  type: string,
  mandatory = true,
  extra?: any,
) => {
  const { newValue, newErrors } = validate<{ value?: T }>({}, {}, value, "value", type, mandatory, extra)
  return { value: newValue?.value, error: newErrors?.value }
}

const validate = <T>(
  initial: T,
  errors: { [key: string]: string },
  value: any,
  name: string,
  type: string,
  mandatory = true,
  extra?: any,
) => {
  const newErrors = { ...errors }
  delete newErrors[name]

  const newValue: Partial<T> = { ...initial }

  if (type === 'boolean') {
    newValue[name] = toBool(value)
  } else if (!isEmpty(value)) {
    if (type === 'BigNumber' || type === 'number') {
      const floatValue = parseFloat(value)
      if (!Number.isNaN(floatValue) && Number.isFinite(floatValue)) {
        if (floatValue < 0) {
          newErrors[name] = 'This number should be positive'
        } else {
          newValue[name] = type === 'BigNumber' ? parseUnits(value, (extra && Number.isInteger(extra) ? extra : 18)) : floatValue
          if (floatValue === 0) newErrors[name] = 'This field is required'
        }
      } else {
        newErrors[name] = 'Please fill in a correct number'
      }
    } else if (type === 'address') {
      if (!Web3.utils.isAddress(value)) {
        newErrors[name] = 'Please fill in a correct address'
      } else {
        newValue[name] = value
      }
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
    newValue[name] = null
  }

  return { newValue, newErrors }
}

export default validate
