import React, { useState, useMemo, useCallback} from 'react'
import { Input, FormFeedback } from 'reactstrap'
import { isEmpty, isNil, isNumber } from 'lodash'
import { Campaign, Token } from 'state/types'
import { BigNumber } from '@ethersproject/bignumber'
import { useBuyTokens } from 'hooks/useContributions'
import { formatBN } from 'utils/formatters'
import { validateSingle } from 'utils/validate'
import { useActiveWeb3React } from 'hooks/web3'
import { useWalletModal } from 'components/WalletModal'
import useAuth from 'hooks/useAuth'
import { parseEther } from '@ethersproject/units'

interface Props {
  campaign: Campaign
  token: Token
}

const Contribute: React.FC<Props> = ({ campaign, token }) => {
  const { account } = useActiveWeb3React()
  const { login, logout } = useAuth()
  const { onPresentConnectModal } = useWalletModal(login, logout, account)

  const [contribution, setContribution] = useState<BigNumber>(null)
  const [contributionError, setContributionError] = useState<string>(null)

  const changeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, error } = validateSingle<BigNumber>(event.target.value, 'BigNumber', false)
    const finalValue = value ?? BigNumber.from(0)

    if (error) {
      setContributionError(error)
    } else if (finalValue && finalValue.gt(0) && finalValue.add(campaign.userContributed).lt(campaign.minAllowed)) {
      setContributionError(`Contribution amount cannot be lower than ${formatBN(campaign.minAllowed)}`)
    } else if (finalValue && finalValue.gt(0) && finalValue.add(campaign.userContributed).gt(campaign.maxAllowed)) {
      setContributionError(`Contribution amount cannot be higher than ${formatBN(campaign.maxAllowed)}`)
    } else {
      setContributionError(null)
    }

    setContribution(finalValue)
  }

  const tokenAmount = useCallback((bnb: number | BigNumber) => {
    const bnbBN = isNumber(bnb) ? parseEther(bnb.toString()) : bnb
    if (!campaign?.rate || campaign.rate.lte(0) || !bnbBN || bnbBN.lte(0)) return '0'
    return formatBN(campaign.rate.mul(bnbBN).div(parseEther('10')), token.decimals)
  }, [campaign, token])

  const contributionTokens = useMemo(() => tokenAmount(contribution), [tokenAmount, contribution])

  const onBuyTokens = useBuyTokens(campaign?.campaignAddress)
  const contributeClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    onBuyTokens(contribution.toString())
  }

  return (
    <>
      <div className="form-group">
        <Input
          type="number"
          aria-describedby="addon-right addon-left"
          placeholder={`1 BNB = ${tokenAmount(1)} tokens`}
          className="classNamem-control"
          onChange={changeValue}
          invalid={!isNil(contributionError)}
          disabled={isNil(campaign)}
        />
        {!isNil(contributionError) ? <FormFeedback>{contributionError}</FormFeedback> : null}
        <p className="text-center">you will get {contributionTokens} tokens</p>
      </div>
      {!isEmpty(account) ? (
        <button
          onClick={contributeClick}
          type="button"
          className="btn btn-primary"
          disabled={contribution?.lte(0) || isNil(campaign) || !isNil(contributionError)}
        >
          Contribute
        </button>
      ) : (
        <button
          onClick={onPresentConnectModal}
          type="button"
          className="btn btn-primary"
        >
          Connect
        </button>
      )}
    </>
  )
}

export default Contribute
