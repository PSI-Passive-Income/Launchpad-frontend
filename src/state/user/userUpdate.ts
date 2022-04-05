import { PSI_API_URL } from 'config/constants/misc'
import { User } from 'state/types'

const userUpdate = async (accessToken: string, user: Partial<User>): Promise<User> => {
  const response = await fetch(`${PSI_API_URL}/users`, {
    body: JSON.stringify(user),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Func-Authorization': `Bearer ${accessToken}`,
    },
    method: 'PATCH',
  })
  if (!response.ok) throw new Error(await response.text())
  return response.json()
}

export default userUpdate
