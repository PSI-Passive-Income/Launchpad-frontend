import { PSI_API_URL } from 'config/constants/misc'
import { User } from 'state/types'

export const getLoggedInUser = async (accessToken: string): Promise<User> => {
  const response = await fetch(`${PSI_API_URL}/users`, {
    method: 'GET',
    headers: {
      'Func-Authorization': `Bearer ${accessToken}`,
    },
  })
  if (!response.ok) throw new Error(await response.text())
  const userString = await response.text()
  return userString ? JSON.parse(userString) : null
}

export const getUserById = async (id: string): Promise<User> => {
  const response = await fetch(`${PSI_API_URL}/users?id=${id}`)
  if (!response.ok) throw new Error(await response.text())
  const userString = await response.text()
  return userString ? JSON.parse(userString) : null
}

export const getUserByAddress = async (address: string): Promise<User> => {
  const response = await fetch(`${PSI_API_URL}/users?publicAddress=${address}`)
  if (!response.ok) throw new Error(await response.text())
  const userString = await response.text()
  return userString ? JSON.parse(userString) : null
}
