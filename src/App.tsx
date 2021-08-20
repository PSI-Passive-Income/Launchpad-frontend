import React from 'react'
import { Router } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useCheckLoginLogout } from 'state/hooks'
// import ResetCSS from './style/ResetCSS'
import GlobalStyle from './style/Global'
import ToastListener from './components/Toast/ToastListener'
import Web3ReactManager from './components/Web3ReactManager'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import PageLoader from './components/PageLoader'
import history from './routerHistory'
import Layout from './views/Layout'

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  // Monkey patch warn() because of web3 flood
  // To be removed when web3 1.3.5 is released
  // useEffect(() => {
  //   console.warn = () => null
  // }, [])

  useCheckLoginLogout()

  return (
    <Router history={history}>
      {/* <ResetCSS /> */}
      <GlobalStyle />
      <SuspenseWithChunkError fallback={<PageLoader />}>
        <Web3ReactManager>
          <Layout />
        </Web3ReactManager>
      </SuspenseWithChunkError>
      <ToastListener />
    </Router>
  )
}

export default React.memo(App)
