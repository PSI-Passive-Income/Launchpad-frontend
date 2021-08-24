import BigNumber from 'bignumber.js'
import { Toast } from '../components/Toast'

// Models

export interface User {
  id: string
  publicAddress: string
  username?: string
}

export enum CampaignStatus {
  All, // used in filtering
  NotStarted,
  Live,
  Failed,
  Ended,
}

export interface Campaign {
  id: number
  campaignAddress: string
  tokenAddress: string
  tokenName: string
  owner: string

  softCap?: BigNumber
  hardCap?: BigNumber
  startDate?: Date
  endDate?: Date
  rate?: BigNumber
  minAllowed?: BigNumber
  maxAllowed?: BigNumber
  poolRate?: BigNumber
  lockDuration?: number
  liquidityRate?: number
  description?: string

  campaignTokens?: BigNumber
  collected?: BigNumber
  remaining?: BigNumber
  locked?: boolean
  unlockDate?: Date
  userContributed?: BigNumber

  status?: CampaignStatus
}

export interface Token {
  address: string
  name: string
  symbol: string
  decimals: number
  totalSupply: BigNumber
  accountBalance?: BigNumber
  approvals?: { [spender: string]: BigNumber }
}

export interface TokenCreationInfo extends Token {
  initialSupply: BigNumber
  maximumSupply: BigNumber
  burnable: boolean
  mintable: boolean
  minterDelay: number
  crossChain: boolean
}

export interface TokenLock {
  id: number
  owner: string
  token: string
  amount: BigNumber
  startTime: Date
  unlockTime?: Date
  duration: number
  releases: number
  amountUnlocked?: BigNumber
  amountToUnlock?: BigNumber
  unlockedAmount?: BigNumber
}

// Slices states

export interface ToastsState {
  data: Toast[]
}

export interface UserState {
  isLoggedIn: boolean
  data: User
  username: string
  accessToken: string
  isLoggingIn: boolean
  loginError: string
  isUpdating: boolean
  updateError: string
}

export interface CampaignsState {
  data: { [key: string]: Campaign }
  dataByAddress: { [key: string]: Campaign }
  isLoading: boolean
  isLoadingCampaign: boolean
  loadingError?: string
  isLoadingCampaignError?: string
  isCreating: boolean
  createError?: string
  isUpdating: boolean
  updateError?: string
}

export interface TokensState {
  data: { [key: string]: Token }
  userTokens: { [key: string]: Token }
  isLoading: boolean
  loadingError?: string
}

export interface TokenLocksState {
  data: { [key: number]: TokenLock }
  userLocks: { [key: string]: { [key: number]: TokenLock } }
  tokenLocks: { [key: string]: { [key: number]: TokenLock } }
  isLoading: boolean
  loadingError?: string
}

// API Price State
export interface PriceApiList {
  /* eslint-disable camelcase */
  [key: string]: {
    name: string
    symbol: string
    price: string
    price_BNB: string
  }
}

export interface PriceApiListThunk {
  /* eslint-disable camelcase */
  [key: string]: number
}

export interface PriceApiResponse {
  /* eslint-disable camelcase */
  updated_at: string
  data: PriceApiList
}

export interface PriceApiThunk {
  /* eslint-disable camelcase */
  updated_at: string
  data: PriceApiListThunk
}

export interface PriceState {
  isLoading: boolean
  lastUpdated: string
  data: PriceApiListThunk
}

// Block

export interface BlockState {
  currentBlock: number
  initialBlock: number
}
