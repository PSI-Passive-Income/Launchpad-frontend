import React from 'react'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { Provider } from 'react-redux'
import { getLibrary } from 'utils/web3React'
import { ThemeContextProvider } from 'contexts/ThemeContext'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import { NetworkContextName } from 'config/constants/misc'
import { ModalProvider } from 'components/Modal'
import { LoaderProvider } from 'components/Loader'
import store from 'state/store'

if (window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = true
}

class ErrorBoundaryWeb3ProviderNetwork extends React.Component<unknown, { hasError: boolean }> {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  render() {
    const { children } = this.props
    const { hasError } = this.state
    let Web3ProviderNetwork
    try {
      Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)
    } catch (e) {
      return children
    }
    if (hasError) {
      return children
    }
    return <Web3ProviderNetwork getLibrary={getLibrary}>{children}</Web3ProviderNetwork>
  }
}

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ErrorBoundaryWeb3ProviderNetwork>
        <Provider store={store}>
          <ThemeContextProvider>
            <RefreshContextProvider>
              <ModalProvider>
                <LoaderProvider>{children}</LoaderProvider>
              </ModalProvider>
            </RefreshContextProvider>
          </ThemeContextProvider>
        </Provider>
      </ErrorBoundaryWeb3ProviderNetwork>
    </Web3ReactProvider>
  )
}

export default Providers
