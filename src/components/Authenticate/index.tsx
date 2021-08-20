import Loader from 'components/Loader'
import useAuth from 'hooks/useAuth'
import { useActiveWeb3React } from 'hooks/web3'
import React from 'react'
import { useLoginWallet, useLoggedInUser } from 'state/hooks'
import Button from '../Button/Button'
import { useWalletModal } from '../WalletModal'

const Authenticate: React.FC = () => {
  const { account } = useActiveWeb3React()
  const { login, logout } = useAuth()
  const { isLoggedIn, isLoggingIn, username } = useLoggedInUser()

  const { onPresentConnectModal, onPresentAccountModal } = useWalletModal(login, logout, account)
  const loginWallet = useLoginWallet()

  let displayName = username
  if (!displayName) {
    displayName = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null
  }

  return (
    <div>
      {isLoggingIn ? (
        <Loader />
      ) : (
        <>
          {account ? (
            <>
              {isLoggedIn ? (
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
                    loginWallet()
                  }}
                >
                  Login
                </Button>
              )}
            </>
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
        </>
      )}
    </div>
  )
}

export default Authenticate
