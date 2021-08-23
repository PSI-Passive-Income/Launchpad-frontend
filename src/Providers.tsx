import React, { SVGProps, useState } from 'react'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { Provider } from 'react-redux'
import { getLibrary } from 'utils/web3React'
import { ThemeContextProvider } from 'contexts/ThemeContext'
import { RefreshContextProvider } from 'contexts/RefreshContext'
import { NetworkContextName } from 'config/constants/misc'
import { ModalProvider } from 'components/Modal'
import store from 'state/store'
import { Bars, LoaderProvider } from '@agney/react-loading'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if (window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = true
}

const loadingProps: SVGProps<SVGSVGElement> = {
  width: 150,
  fill: '#2fcbeb'
}

// const ErrorBoundaryWeb3ProviderNetwork: React.FC = ({ children }) => {
//   try {
//     const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)
//     return <Web3ProviderNetwork getLibrary={getLibrary}>{children}</Web3ProviderNetwork>
//   } catch (e) {
//     return <>{children}</>
//   }
// }
 

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Provider store={store}>
          <ThemeContextProvider>
            <RefreshContextProvider>
              <ModalProvider>
                <LoaderProvider indicator={<Bars {...loadingProps} />}>{children}</LoaderProvider>
              </ModalProvider>
            </RefreshContextProvider>
          </ThemeContextProvider>
        </Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  )
}

export default Providers
