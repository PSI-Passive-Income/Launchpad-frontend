import React, { useMemo, useState } from 'react'
import { Input } from 'reactstrap'
import { Campaign } from 'state/types'
import useWhitelisting from 'hooks/useWhitelist'

interface Props {
  campaign: Campaign
}

const WhitelistAdd: React.FC<Props> = ({ campaign }) => {
  const [whitelistAddresses, setWhitelistAddresses] = useState('')

  const { setWhitelist, setWhitelistEnabled, settingWhitelist } = useWhitelisting(campaign?.campaignAddress)
  const onEnabled = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, enabled: boolean) => {
    event.preventDefault()
    setWhitelistEnabled(enabled)
  }

  const addresses = useMemo(() => whitelistAddresses?.split('\n').map((a) => a.trim()).filter(a => a), [whitelistAddresses])

  const onSetWhitelist = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, enabled: boolean) => {
    event.preventDefault()
    if (addresses && addresses.length > 0) {
      setWhitelist(addresses, enabled)
    }
  }

  return (
    <div className="presale-whitelist-add text-center mx-auto mt-3">
      <button
        type="button"
        onClick={(e) => onEnabled(e, !campaign?.whitelistEnabled)}
        className="btn btn-primary"
        disabled={settingWhitelist}
      >
        {campaign?.whitelistEnabled ? 'Disable whitelisting' : 'Enable whitelisting'}
      </button>

      {campaign?.whitelistEnabled ? (
        <>
          <p className="mt-3">
            Add whitelist users by providing an address on every line and click on &apos;Add&apos; or &apos;Remove&apos;<br/>
            to add/remove the addresses to/from the whitelist
          </p>
          <Input
            onChange={(e) => setWhitelistAddresses(e.target.value)}
            type="textarea"
            style={{ height: '200px', maxHeight: 'inherit', maxWidth: '700px' }}
            className="form-control mx-auto"
            placeholder="Whitelist addresses (1 per row)"
          />
          <div className="mt-2">
            <button
              type="button"
              onClick={(e) => onSetWhitelist(e, true)}
              className="btn btn-primary"
              disabled={!addresses || settingWhitelist}
            >
              Add
            </button>
            <button
              type="button"
              onClick={(e) => onSetWhitelist(e, false)}
              className="btn btn-primary ml-3"
              disabled={!addresses || settingWhitelist}
            >
              Remove
            </button>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default WhitelistAdd
