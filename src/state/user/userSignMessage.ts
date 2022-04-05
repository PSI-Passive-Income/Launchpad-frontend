import { ApplicationName } from 'config/constants/misc'
import { Web3Provider } from '@ethersproject/providers'

const userSignMessage = async (library: Web3Provider, publicAddress: string, nonce: string): Promise<string> => {
  try {
    const signature = await library
      .getSigner(publicAddress)
      .signMessage(`I am signing in to ${ApplicationName}. Unique nonce: ${nonce}`)

    return signature
  } catch (err) {
    throw new Error('You need to sign the message to be able to log in.')
  }
}

export default userSignMessage
