import { PSI_API_URL } from 'config/constants/misc'
import { User } from 'state/types'

const getUserByAddress = async (address: string): Promise<User> => {
  const response = await fetch(`${PSI_API_URL}/users?publicAddress=${address}`)
  if (!response.ok) throw new Error(await response.text())
  const userString = await response.text()
  return userString ? JSON.parse(userString) : null
}

export default getUserByAddress
