import React, { useState } from 'react'
import styled from 'styled-components'
import { Modal } from '../Modal'
import WalletCard, { MoreWalletCard } from './WalletCard'
import { Box, Grid } from '../Box'
import { Text } from '../Text'
import { Button } from '../Button'
import getExternalLinkProps from '../../utils/getExternalLinkProps'
import config, { walletLocalStorageKey } from './config'
import { Config, Login } from './types'

interface Props {
  login: Login
  onDismiss?: () => void
  displayCount?: number
}

const WalletWrapper = styled(Box)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
`

/**
 * Checks local storage if we have saved the last wallet the user connected with
 * If we find something we put it at the top of the list
 *
 * @returns sorted config
 */
const getPreferredConfig = (walletConfig: Config[]) => {
  const preferredWalletName = localStorage.getItem(walletLocalStorageKey)
  const sortedConfig = walletConfig.sort((a: Config, b: Config) => a.priority - b.priority)

  if (!preferredWalletName) {
    return sortedConfig
  }

  const preferredWallet = sortedConfig.find((sortedWalletConfig) => sortedWalletConfig.title === preferredWalletName)

  if (!preferredWallet) {
    return sortedConfig
  }

  return [
    preferredWallet,
    ...sortedConfig.filter((sortedWalletConfig) => sortedWalletConfig.title !== preferredWalletName),
  ]
}

const ConnectModal: React.FC<Props> = ({ login, onDismiss = () => null, displayCount = 3 }) => {
  const [showMore, setShowMore] = useState(false)
  // const theme = useTheme()
  const sortedConfig = getPreferredConfig(config)
  const displayListConfig = showMore ? sortedConfig : sortedConfig.slice(0, displayCount)

  return (
    <Modal title="Connect to a wallet" onDismiss={onDismiss}>
      <WalletWrapper py="24px" maxHeight="453px" overflowY="auto">
        <Grid gridTemplateColumns="1fr 1fr">
          {displayListConfig.map((wallet) => (
            <Box key={wallet.title}>
              <WalletCard walletConfig={wallet} login={login} onDismiss={onDismiss} />
            </Box>
          ))}
          {!showMore && <MoreWalletCard onClick={() => setShowMore(true)} />}
        </Grid>
      </WalletWrapper>
      <Box p="24px">
        <Text textAlign="center" color="textSubtle" as="p" mb="16px">
          Haven&nbsp;t got a crypto wallet yet?
        </Text>
        <Button
          as="a"
          href="https://docs.pancakeswap.finance/get-started/connection-guide"
          variant="subtle"
          width="100%"
          {...getExternalLinkProps()}
        >
          Learn How to Connect
        </Button>
      </Box>
    </Modal>
  )
}

export default ConnectModal
