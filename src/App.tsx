import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useCheckLoginLogout } from 'state/hooks'
import { useEagerConnect } from 'hooks/web3'
// import ResetCSS from './style/ResetCSS'
import GlobalStyle from './style/Global'
import ToastListener from './components/Toast/ToastListener'
import Web3ReactManager from './components/Web3ReactManager'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import PageLoader from './components/PageLoader'
import Layout from './views/Layout'

const App: React.FC = () => {
  useEagerConnect()
  useCheckLoginLogout()

  return (
    <Router>
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
