import { ApplicationName } from 'config/constants/misc'
import Web3 from 'web3'

const userSignMessage = async (web3: Web3, publicAddress: string, nonce: string): Promise<string> => {
  try {
    const signature = await web3.eth.personal.sign(
      `I am signing in to ${ApplicationName}. Unique nonce: ${nonce}`,
      publicAddress,
      '', // MetaMask will ignore the password argument here
    )

    return signature
  } catch (err) {
    throw new Error('You need to sign the message to be able to log in.')
  }
}

export default userSignMessage
