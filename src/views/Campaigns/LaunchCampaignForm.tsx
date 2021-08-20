import React, { useMemo, useState } from 'react'
import { useLoading } from '@agney/react-loading'
import { Card, CardBody, Form, Input, Label, Container, FormFeedback, FormText } from 'reactstrap'
import Datetime from 'react-datetime'
import { Moment } from 'moment'
import { useCampaignFactoryApproval, useCreateCampaign, useTokensNeeded } from 'hooks/useCreateCampaign'
import { Campaign } from 'state/types'
import { isEmpty, isNil } from 'lodash'
import validate from 'utils/validate'
import { formatBN } from 'utils/formatters'

const LaunchCampaignForm: React.FC = () => {
  const [campaign, setCampaign] = useState<Partial<Campaign>>({})

  const tokensNeeded = useTokensNeeded(campaign)
  const [valid, setValid] = useState(false)

  const { createCampaign, creatingCampaign } = useCreateCampaign()

  const { token, isLoadingToken, approve, approving, approvedAmount } = useCampaignFactoryApproval(
    campaign.tokenAddress,
  )

  const isApproved = useMemo(
    () => tokensNeeded && approvedAmount && approvedAmount.gte(tokensNeeded),
    [tokensNeeded, approvedAmount],
  )

  const [errors, setErrors] = useState<any>({})

  const validateCampaign = (newCampaign: Partial<Campaign>, validateMandatory = false) => {
    if (newCampaign.maxAllowed && newCampaign.minAllowed && !newCampaign.maxAllowed.gte(newCampaign.minAllowed))
      setErrors({ ...errors, maxAllowed: 'Maximum allowed should be higher than (or equal to) minimum allowed' })
    if (newCampaign.maxAllowed && newCampaign.hardCap && !newCampaign.maxAllowed.lte(newCampaign.hardCap))
      setErrors({ ...errors, maxAllowed: 'Maximum allowed should be lower than the hard cap' })
    if (newCampaign.hardCap && newCampaign.softCap && !newCampaign.hardCap.gte(newCampaign.softCap))
      setErrors({ ...errors, hardCap: 'Hard cap should be higher than (or equal to) soft cap' })
    if (tokensNeeded && token.accountBalance && tokensNeeded.gt(token.accountBalance))
      setErrors({ ...errors, rate: 'You do no not have enough tokens in your wallet' })

    const mandatoryErrors = valideMandatory(newCampaign)
    if (validateMandatory) setErrors({ ...errors, ...mandatoryErrors })

    if (isEmpty(errors) && isEmpty(mandatoryErrors)) setValid(true)
    else setValid(false)

    setCampaign(newCampaign)
  }

  const valideMandatory = (newCampaign: Partial<Campaign>) => {
    const mandatoryErrors = {}
    if (isNil(newCampaign.softCap)) setErrors({ ...mandatoryErrors, softCap: 'This field is required' })
    if (isNil(newCampaign.hardCap)) setErrors({ ...mandatoryErrors, hardCap: 'This field is required' })
    if (isNil(newCampaign.startDate)) setErrors({ ...mandatoryErrors, startDate: 'This field is required' })
    if (isNil(newCampaign.endDate)) setErrors({ ...mandatoryErrors, endDate: 'This field is required' })
    if (isNil(newCampaign.rate)) setErrors({ ...mandatoryErrors, rate: 'This field is required' })
    if (isNil(newCampaign.minAllowed)) setErrors({ ...mandatoryErrors, minAllowed: 'This field is required' })
    if (isNil(newCampaign.maxAllowed)) setErrors({ ...mandatoryErrors, maxAllowed: 'This field is required' })
    if (isNil(newCampaign.poolRate)) setErrors({ ...mandatoryErrors, poolRate: 'This field is required' })
    if (isNil(newCampaign.lockDuration)) setErrors({ ...mandatoryErrors, lockDuration: 'This field is required' })
    if (isNil(newCampaign.liquidityRate)) setErrors({ ...mandatoryErrors, liquidityRate: 'This field is required' })
    if (isNil(newCampaign.description)) setErrors({ ...mandatoryErrors, description: 'This field is required' })
    return mandatoryErrors
  }

  const changeValue = (value: string | Moment, name: string, type: string, mandatory = true) => {
    const { newValue, newErrors } = validate(campaign, errors, value, name, type, mandatory)
    setErrors({ ...errors, ...newErrors })
    validateCampaign(newValue)
  }

  const onApprove = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    approve()
  }

  const onCreate = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    validateCampaign(campaign, true)
    if (isEmpty(errors)) createCampaign(campaign)
  }

  const { containerProps, indicatorEl } = useLoading({
    loading: isLoadingToken || approving || creatingCampaign,
  })

  return (
    <div className="content" {...containerProps}>
      {indicatorEl}
      <Card>
        <Container>
          <CardBody>
            <Form>
              <h5 slot="header" className="title">
                Launch Project
              </h5>

              <div className="row">
                <div className="col-md-12 pr-md-1">
                  <Label>Token Address</Label>
                  <Input
                    value={campaign.tokenAddress}
                    onChange={(e) => changeValue(e.target.value, 'tokenAddress', 'address')}
                    label="Token Address"
                    placeholder="Enter token address"
                    invalid={!!errors.tokenAddress}
                  />
                  {errors.tokenAddress ? <FormFeedback>{errors.tokenAddress}</FormFeedback> : null}
                  {!isEmpty(token) ? (
                    <FormText>
                      {token.name} - {formatBN(token.totalSupply)} {token.symbol}
                    </FormText>
                  ) : null}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 pr-md-1">
                  <Label>Hard cap</Label>
                  <Input
                    value={campaign.hardCap?.toFormat(18)}
                    onChange={(e) => changeValue(e.target.value, 'hardCap', 'BigNumber')}
                    label="Hardcap"
                    placeholder="Hard cap"
                    invalid={!!errors.hardCap}
                  />
                  {errors.hardCap ? <FormFeedback>{errors.hardCap}</FormFeedback> : null}
                </div>
                <div className="col-md-6 pr-md-1">
                  <Label>Soft cap</Label>

                  <Input
                    value={campaign.softCap?.toFormat(18)}
                    onChange={(e) => changeValue(e.target.value, 'softCap', 'BigNumber')}
                    label="Softcap"
                    placeholder="Soft cap"
                    invalid={!!errors.softCap}
                  />
                  {errors.softCap ? <FormFeedback>{errors.softCap}</FormFeedback> : null}
                </div>
                <div className="col-md-6 pr-md-1">
                  <Label>Minimum BNB per wallet</Label>
                  <Input
                    value={campaign.minAllowed?.toFormat(18)}
                    onChange={(e) => changeValue(e.target.value, 'minAllowed', 'BigNumber')}
                    label="Min BNB per wallet"
                    placeholder="Min BNB per wallet"
                    invalid={!!errors.minAllowed}
                  />
                  {errors.minAllowed ? <FormFeedback>{errors.minAllowed}</FormFeedback> : null}
                </div>
                <div className="col-md-6 pr-md-1">
                  <Label>Max BNB per wallet</Label>
                  <Input
                    value={campaign.maxAllowed?.toFormat(18)}
                    onChange={(e) => changeValue(e.target.value, 'maxAllowed', 'BigNumber')}
                    label="Max BNB per wallet"
                    placeholder="Max BNB per wallet"
                    invalid={!!errors.maxAllowed}
                  />
                  {errors.maxAllowed ? <FormFeedback>{errors.maxAllowed}</FormFeedback> : null}
                </div>
              </div>

              <div className="row">
                <div className="col-md-8 pr-md-1">
                  <Label>Percentage allocated to PancakeSwap</Label>
                  <Input
                    label="Percentage allocated to PancakeSwap"
                    type="range"
                    value={campaign.liquidityRate ?? 0 / 100}
                    onChange={(e) => changeValue(e.target.value, 'liquidityRate', 'number')}
                    invalid={!!errors.liquidityRate}
                  />
                  {errors.liquidityRate ? <FormFeedback>{errors.liquidityRate}</FormFeedback> : null}
                </div>
                <div className="col-md-4 pr-md-1 text-white">
                  <span>{campaign.liquidityRate} %</span>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-md-6 pr-md-1">
                  <Label>Token per BNB</Label>
                  <Input
                    value={campaign.rate?.toFormat(18)}
                    onChange={(e) => changeValue(e.target.value, 'rate', 'BigNumber')}
                    label="Token per BNB"
                    placeholder="Token per ETH"
                    invalid={!!errors.rate}
                  />
                  {errors.rate ? <FormFeedback>{errors.rate}</FormFeedback> : null}
                </div>
                <div className="col-md-6 pr-md-1">
                  <Label>Token per BNB in liquidity pool</Label>
                  <Input
                    value={campaign.poolRate?.toFormat(18)}
                    onChange={(e) => changeValue(e.target.value, 'poolRate', 'BigNumber')}
                    label="Token per BNB"
                    placeholder="Token per ETH"
                    invalid={!!errors.poolRate}
                  />
                  {errors.poolRate ? <FormFeedback>{errors.poolRate}</FormFeedback> : null}
                </div>
                <div className="col-md-6 pr-md-1">
                  <Label>Liquidity lock duration (in days)</Label>
                  <Input
                    value={campaign.lockDuration}
                    onChange={(e) => changeValue(e.target.value, 'lockDuration', 'number')}
                    label="Liquidity lock duration (in days)"
                    placeholder="Liquidity lock duration (in days)"
                    invalid={!!errors.lockDuration}
                  />
                  {errors.lockDuration ? <FormFeedback>{errors.lockDuration}</FormFeedback> : null}
                </div>
                <div className="col-md-6 pr-md-1">
                  <Label>Start date</Label>
                  <Datetime
                    className="form-control"
                    value={campaign.startDate}
                    onChange={(v) => changeValue(v, 'startDate', 'date')}
                    input={false}
                    inputProps={{ placeholder: 'Start date' }}
                  />
                  {errors.startDate ? <FormFeedback>{errors.startDate}</FormFeedback> : null}
                </div>
                <div className="col-md-6 pr-md-1">
                  <Label>End date</Label>
                  <Datetime
                    className="form-control"
                    value={campaign.endDate}
                    onChange={(v) => changeValue(v, 'endDate', 'date')}
                    input={false}
                    inputProps={{ placeholder: 'End date' }}
                  />
                  {errors.endDate ? <FormFeedback>{errors.endDate}</FormFeedback> : null}
                </div>
              </div>

              <div className="row">
                <div className="col-md-8">
                  <Label>Description</Label>
                  <Input
                    value={campaign.description}
                    onChange={(e) => changeValue(e.target.value, 'description', 'text')}
                    type="textarea"
                    rows="4"
                    cols="80"
                    className="form-control"
                    placeholder="Your project description"
                    invalid={!!errors.description}
                  />
                  {errors.description ? <FormFeedback>{errors.description}</FormFeedback> : null}
                </div>
              </div>
              {/* <button variant="seconday" className="btn" type="submit">
                Save
              </button> */}
              {!isApproved ? (
                <button onClick={onApprove} className="btn btn-primary" type="button" disabled={!valid}>
                  Approve
                </button>
              ) : (
                <button onClick={onCreate} className="btn btn-primary" type="button" disabled={!valid}>
                  Launch
                </button>
              )}
            </Form>
          </CardBody>
        </Container>
      </Card>
    </div>
  )
}

export default LaunchCampaignForm
