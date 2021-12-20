import { useCallback, useState } from "react"
import { useDispatch } from "react-redux"
import { getCampaign } from "state/actions"
import { setWhitelist, handleTransactionCall, setWhitelistEnabled } from "utils/callHelpers"
import { useCampaign } from "./useContract"
import { useActiveWeb3React } from "./web3"

const useWhitelisting = (campaignAddress: string) => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const campaign = useCampaign(campaignAddress)
  const [settingWhitelist, setSettingWhitelist] = useState(false)

  const handleSetWhitelist = useCallback(
    async (addresses: string[], whitelist: boolean) => {
      if (account && campaign && addresses) {
        try {
          setSettingWhitelist(true)
          const success = await handleTransactionCall(() => setWhitelist(campaign, addresses, whitelist), dispatch)
          if (success) dispatch(getCampaign(campaignAddress, account))
        } finally { setSettingWhitelist(false) }
      }
    },
    [dispatch, account, campaign, campaignAddress],
  )

  const handleSetWhitelistEnabled = useCallback(
    async (enabled) => {
      if (account && campaign) {
        try {
          setSettingWhitelist(true)
          const success = await handleTransactionCall(() => setWhitelistEnabled(campaign, enabled), dispatch)
          if (success) dispatch(getCampaign(campaignAddress, account))
        } finally { setSettingWhitelist(false) }
      }
    },
    [dispatch, account, campaign, campaignAddress],
  )

  return { setWhitelist: handleSetWhitelist, setWhitelistEnabled: handleSetWhitelistEnabled, settingWhitelist }
}

export default useWhitelisting