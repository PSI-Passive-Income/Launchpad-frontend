import Loader from 'components/LoaderCircle'
import useAuth from 'hooks/useAuth'
import { useActiveWeb3React } from 'hooks/web3'
import React from 'react'
import { useLogin } from 'state/hooks'
import { useWalletModal } from '../WalletModal'

const Authenticate: React.FC = () => {
  const { account } = useActiveWeb3React()
  const { connect, disconnect } = useAuth()

  const { onPresentConnectModal, onPresentAccountModal } = useWalletModal(connect, disconnect, account)
  const { isLoggedIn, isLoggingIn, user, login } = useLogin()

  let displayName = user?.username
  if (!displayName) {
    displayName = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null
  }

  return (
    <div className="authentication">
      {isLoggingIn ? (
        <Loader />
      ) : account ? (
        isLoggedIn ? (
          <button
            type="submit"
            className="btn btn-outline-light my-2 my-sm-0 px-4 btn-lg me-3 shadow-none"
            onClick={() => {
              onPresentAccountModal()
            }}
          >
            {displayName}
          </button>
        ) : (
          <button
            type="submit"
            className="btn btn-outline-light my-2 my-sm-0 px-4 btn-lg me-3 shadow-none"
            onClick={() => {
              login()
            }}
          >
            Login
          </button>
        )
      ) : (
        <button
          type="submit"
          className="btn btn-outline-light my-2 my-sm-0 px-4 btn-lg me-3 shadow-none"
          onClick={() => {
            onPresentConnectModal()
          }}
        >
          Connect
        </button>
      )}
    </div>
  )
}

export default Authenticate
