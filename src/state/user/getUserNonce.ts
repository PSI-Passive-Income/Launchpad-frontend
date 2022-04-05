import { PSI_API_URL } from 'config/constants/misc'

const getUserNonce = async (address: string): Promise<string | null> => {
  const response = await fetch(`${PSI_API_URL}/auth?publicAddress=${address}`)
  if (!response.ok) throw new Error(await response.text())
  const nonce = await response.text()
  return nonce && nonce !== '{}' ? nonce : null
}

export default getUserNonce
