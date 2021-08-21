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

  const [submitClicked, setSubmitClicked] = useState(false)
  const { createCampaign, creatingCampaign } = useCreateCampaign()

  const { token, isLoadingToken, approve, approving, approvedAmount } = useCampaignFactoryApproval(
    campaign.tokenAddress,
  )

  const isApproved = useMemo(
    () => tokensNeeded && approvedAmount && approvedAmount.gte(tokensNeeded),
    [tokensNeeded, approvedAmount],
  )

  const [validationErrors, setErrors] = useState<{ [key: string]: string }>({})

  const mandatoryErrors = useMemo(() => {
    const _errors: { [key: string]: string } = {}
    if (isNil(campaign.softCap)) _errors.softCap = 'This field is required'
    if (isNil(campaign.hardCap)) _errors.hardCap = 'This field is required'
    if (isNil(campaign.startDate)) _errors.startDate = 'This field is required'
    if (isNil(campaign.endDate)) _errors.endDate = 'This field is required'
    if (isNil(campaign.rate)) _errors.rate = 'This field is required'
    if (isNil(campaign.minAllowed)) _errors.minAllowed = 'This field is required'
    if (isNil(campaign.maxAllowed)) _errors.maxAllowed = 'This field is required'
    if (isNil(campaign.poolRate)) _errors.poolRate = 'This field is required'
    if (isNil(campaign.lockDuration)) _errors.lockDuration = 'This field is required'
    if (isNil(campaign.liquidityRate)) _errors.liquidityRate = 'This field is required'
    if (isEmpty(campaign.description)) _errors.description = 'This field is required'
    return _errors
  }, [campaign])

  const errors: { [key: string]: string } = useMemo(() => {
    const _errors = { ...(submitClicked ? mandatoryErrors : {}), ...validationErrors }

    if (campaign.maxAllowed && campaign.minAllowed && !campaign.maxAllowed.gte(campaign.minAllowed))
      _errors.maxAllowed = 'Maximum allowed should be higher than (or equal to) minimum allowed'
    if (campaign.maxAllowed && campaign.hardCap && !campaign.maxAllowed.lte(campaign.hardCap))
      _errors.maxAllowed = 'Maximum allowed should be lower than the hard cap'
    if (campaign.hardCap && campaign.softCap && !campaign.hardCap.gte(campaign.softCap))
      _errors.hardCap = 'Hard cap should be higher than (or equal to) soft cap'
    if (tokensNeeded && token?.accountBalance && tokensNeeded.gt(token.accountBalance))
      _errors.rate = 'You do no not have enough tokens in your wallet'

    return _errors
  }, [validationErrors, submitClicked, mandatoryErrors, campaign, tokensNeeded, token?.accountBalance])

  const valid = useMemo(() => isEmpty(errors) && isEmpty(mandatoryErrors), [errors, mandatoryErrors])

  const changeValue = (value: string | Moment, name: string, type: string, mandatory = true) => {
    const { newValue, newErrors } = validate(campaign, errors, value, name, type, mandatory)
    setErrors({ ...validationErrors, ...newErrors })
    setCampaign(newValue)
  }

  const onApprove = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    approve()
  }

  const onCreate = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    if (!submitClicked) setSubmitClicked(true)
    if (valid) {
      createCampaign(campaign)
    }
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

              {!isEmpty(token) ? (
                <>
                  <div className="row">
                    <div className="col-md-6 pr-md-1">
                      <Label>Hard cap</Label>
                      <Input
                        value={formatBN(campaign.hardCap, 18, true)}
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
                        value={formatBN(campaign.softCap, 18, true)}
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
                        value={formatBN(campaign.minAllowed, 18, true)}
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
                        value={formatBN(campaign.maxAllowed, 18, true)}
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
                        value={formatBN(campaign.rate, token.decimals, true)}
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
                        value={formatBN(campaign.poolRate, token.decimals, true)}
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
                        value={campaign.startDate}
                        onChange={(v) => changeValue(v, 'startDate', 'date')}
                        inputProps={{ placeholder: 'Start date' }}
                      />
                      {errors.startDate ? <FormFeedback>{errors.startDate}</FormFeedback> : null}
                    </div>
                    <div className="col-md-6 pr-md-1">
                      <Label>End date</Label>
                      <Datetime
                        value={campaign.endDate}
                        onChange={(v) => changeValue(v, 'endDate', 'date')}
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
                </>
              ) : null}
            </Form>
          </CardBody>
        </Container>
      </Card>
    </div>
  )
}

export default LaunchCampaignForm
