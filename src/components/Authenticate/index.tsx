import Loader from 'components/LoaderCircle'
import useAuth from 'hooks/useAuth'
import React from 'react'
import { useLogin } from 'state/hooks'
import { useWalletModal } from '../WalletModal'
import Button from '../Button/Button'

const Authenticate: React.FC = () => {
  const { connect, disconnect } = useAuth()
  const { account, isLoggedIn, isLoggingIn, user, login } = useLogin()

  const { onPresentConnectModal, onPresentAccountModal } = useWalletModal(connect, disconnect, account)

  let displayName = user?.username
  if (!displayName) {
    displayName = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null
  }

  return (
    <div>
      {isLoggingIn ? (
        <Loader />
      ) : account ? (
        isLoggedIn ? (
          <Button
            color="info"
            scale="sm"
            variant="tertiary"
            className="btn-simple active wallet-button"
            onClick={() => {
              onPresentAccountModal()
            }}
          >
            {displayName}
          </Button>
        ) : (
          <Button
            color="info"
            scale="sm"
            className="btn-simple active wallet-button"
            onClick={() => {
              login()
            }}
          >
            Login
          </Button>
        )
      ) : (
        <Button
          color="info"
          scale="sm"
          className="btn-simple active wallet-button"
          onClick={() => {
            onPresentConnectModal()
          }}
        >
          Connect
        </Button>
      )}
    </div>
  )
}

export default Authenticate
