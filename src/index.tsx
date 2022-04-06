import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import { isMobile } from 'react-device-detect'
import App from './App'
import Providers from './Providers'

// scss added in back-dashboard.scss
// import 'bootstrap/dist/css/bootstrap.min.css'
import 'assets/sass/black-dashboard.scss'
import 'assets/demo/demo.css'
import 'assets/css/nucleo-icons.css'
import 'assets/css/styles.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'react-datetime/css/react-datetime.css'
import reportWebVitals from './reportWebVitals'

let browserType = 'desktop'
if (isMobile) {
  browserType = 'web3' in window || 'ethereum' in window ? 'mobileWeb3' : 'mobileRegular'
}

const GOOGLE_ANALYTICS_ID: string | undefined = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
if (typeof GOOGLE_ANALYTICS_ID === 'string') {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID, {
    gaOptions: {
      storage: 'none',
      storeGac: false,
    },
  })
  ReactGA.set({
    anonymizeIp: true,
    customBrowserType: browserType,
  })
} else {
  ReactGA.initialize('test', { testMode: true, debug: true })
}

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
