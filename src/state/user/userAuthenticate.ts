import { ApplicationName, PSI_API_URL } from 'config/constants/misc'
import { User } from 'state/types'

const userAuthenticate = async (
  publicAddress: string,
  signature: string,
): Promise<{ username: string; user: User; accessToken: string }> => {
  const response = await fetch(`${PSI_API_URL}/auth`, {
    body: JSON.stringify({ publicAddress, signature, application: ApplicationName }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
  if (!response.ok) throw new Error(await response.text())
  return response.json()
}

export default userAuthenticate
