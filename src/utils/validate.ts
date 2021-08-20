import { isEmpty } from 'lodash'
import { utils } from 'ethers'
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
  // newValue[name] = value

  console.log(newValue, name, value, type)
  if (type === 'boolean') {
    newValue[name] = toBool(value)
  } else if (!isEmpty(value)) {
    if (type === 'BigNumber' || type === 'number') {
      const floatValue = parseFloat(value)
      if (!Number.isNaN(floatValue) && Number.isFinite(floatValue)) {
        if (floatValue < 0) {
          newErrors[name] = 'This number shoulde be positive'
        } else {
          newValue[name] = type === 'BigNumber' ? utils.parseUnits(value, 18) : value
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
