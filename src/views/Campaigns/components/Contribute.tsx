import React, { useState, useMemo, useCallback} from 'react'
import { Input, FormFeedback } from 'reactstrap'
import { isFinite, isNil, toFinite } from 'lodash'
import { Campaign } from 'state/types'
import BigNumber from 'bignumber.js'
import { useBuyTokens } from 'hooks/useContributions'
import { formatBN } from 'utils/formatters'

interface Props {
  campaign: Campaign
}

const Contribute: React.FC<Props> = ({ campaign }) => {
  const [contribution, setContribution] = useState(0)
  const [contributionError, setContributionError] = useState<string>(null)

  const checkBnbValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target
    if (!isFinite(value)) {
      setContributionError('Contribution amount is not a valid number')
    } else {
      const amount = toFinite(value)
      if (amount <= 0 || amount < campaign.minAllowed.toNumber()) {
        setContributionError(`Contribution amount cannot be lower than ${campaign.minAllowed.toNumber()}`)
      } else if (amount > campaign.maxAllowed.toNumber()) {
        setContributionError(`Contribution amount cannot be higher than ${campaign.maxAllowed.toNumber()}`)
      } else {
        setContributionError(null)
        setContribution(toFinite(value))
      }
    }
  }

  const tokenAmount = useCallback((bnb: number) => {
    if (isNil(campaign) || !bnb) return '0'
    return formatBN(campaign.rate.multipliedBy(new BigNumber(contribution)))
  }, [campaign, contribution])

  const contributionTokens = useMemo(() => tokenAmount(contribution), [tokenAmount, contribution])

  const onBuyTokens = useBuyTokens(campaign?.campaignAddress)
  const contributeClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    onBuyTokens(contribution)
  }

  return (
    <>
      <div className="form-group">
        <Input
          type="number"
          aria-describedby="addon-right addon-left"
          placeholder={`1 BNB = ${tokenAmount(1)} tokens`}
          className="classNamem-control"
          value={contribution}
          onChange={checkBnbValue}
          invalid={!isNil(contributionError)}
          disabled={isNil(campaign)}
        />
        {!isNil(contributionError) ? <FormFeedback>{contributionError}</FormFeedback> : null}
        <p className="text-center">you will get {contributionTokens} tokens</p>
      </div>
      <button
        onClick={contributeClick}
        type="button"
        className="btn btn-primary"
        disabled={contribution <= 0 || isNil(campaign) || !isNil(contributionError)}
      >
        Contribute
      </button>
    </>
  )
}

export default Contribute
