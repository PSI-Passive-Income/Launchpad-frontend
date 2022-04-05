import React, { useMemo, useState } from 'react'
import { Card, Form, Container } from 'react-bootstrap'
import Datetime from 'react-datetime'
import { Moment } from 'moment'
import { useCampaignFactoryApproval, useCreateCampaign, useTokensNeeded } from 'hooks/useCreateCampaign'
import { Campaign } from 'state/types'
import { isEmpty, isNil } from 'lodash'
import validate from 'utils/validate'
import { formatBN } from 'utils/formatters'
import { useGlobalLoader } from 'components/Loader'

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

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const changeValue = (
    value: string | Moment | boolean,
    name: string,
    type: string,
    mandatory = true,
    extra: any = undefined,
  ) => {
    const { newValue, newErrors } = validate(campaign, validationErrors, value, name, type, mandatory, extra)
    setValidationErrors(newErrors)
    setCampaign(newValue)
  }

  // changeValue(token.name, "tokenName", "string")
  // changeValue(token.symbol, "tokenSymbol", "string")

  const mandatoryErrors = useMemo(() => {
    const _errors: { [key: string]: string } = {}
    if (isNil(campaign.softCap) || campaign.softCap.lte(0)) _errors.softCap = 'This field is required'
    if (isNil(campaign.hardCap) || campaign.hardCap.lte(0)) _errors.hardCap = 'This field is required'
    if (isNil(campaign.startDate)) _errors.startDate = 'This field is required'
    if (isNil(campaign.endDate)) _errors.endDate = 'This field is required'
    if (isNil(campaign.rate) || campaign.rate.lte(0)) _errors.rate = 'This field is required'
    if (isNil(campaign.minAllowed) || campaign.minAllowed.lte(0)) _errors.minAllowed = 'This field is required'
    if (isNil(campaign.maxAllowed) || campaign.maxAllowed.lte(0)) _errors.maxAllowed = 'This field is required'
    if (isNil(campaign.poolRate) || campaign.poolRate.lte(0)) _errors.poolRate = 'This field is required'
    if (isNil(campaign.lockDuration) || campaign.lockDuration <= 0) _errors.lockDuration = 'This field is required'
    if (isNil(campaign.liquidityRate) || campaign.liquidityRate <= 0) _errors.liquidityRate = 'This field is required'
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
      _errors.rate = `You do no not have enough tokens in your wallet (needed: ${formatBN(
        tokensNeeded,
        token.decimals,
      )})`
    if (campaign.endDate && campaign.startDate && campaign.endDate.getTime() <= campaign.startDate.getTime())
      _errors.endDate = 'End date should be later than the start date and time'
    if (campaign.startDate && campaign.startDate.getTime() <= Date.now())
      _errors.startDate = 'Start date should be later than the current date and time'
    if (campaign.endDate && campaign.endDate.getTime() <= Date.now())
      _errors.endDate = 'End date should be later than the current date and time'

    return _errors
  }, [validationErrors, submitClicked, mandatoryErrors, campaign, tokensNeeded, token?.accountBalance, token?.decimals])

  const valid = useMemo(() => isEmpty(errors) && isEmpty(mandatoryErrors), [errors, mandatoryErrors])

  const onApprove = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    approve()
  }

  const onCreate = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    if (!submitClicked) setSubmitClicked(true)
    if (valid) {
      createCampaign({
        ...campaign,
        lockDuration: campaign.lockDuration * 60 * 60,
        liquidityRate: campaign.liquidityRate * 100,
      })
    }
  }

  const loading = isLoadingToken || approving || creatingCampaign
  useGlobalLoader(loading)

  return (
    <div className="content">
      <Card>
        <Container>
          <Card.Body>
            <Form>
              <h5 slot="header" className="title">
                Launch Project
              </h5>

              <div className="row">
                <div className="col-md-12 pr-md-1">
                  <Form.Label>Token Address</Form.Label>
                  <Form.Control
                    value={campaign.tokenAddress || ''}
                    onChange={(e) => changeValue(e.target.value, 'tokenAddress', 'address')}
                    placeholder="Enter token address"
                    isInvalid={!!errors.tokenAddress}
                  />
                  {errors.tokenAddress ? <Form.Control.Feedback>{errors.tokenAddress}</Form.Control.Feedback> : null}
                  {!isEmpty(token) ? (
                    <Form.Text>
                      {token.name} - {formatBN(token.totalSupply, token.decimals)} {token.symbol}
                    </Form.Text>
                  ) : null}
                </div>
              </div>

              {!isEmpty(token) ? (
                <>
                  <div className="row">
                    <div className="col-md-6 pr-md-1">
                      <Form.Label>Hard cap</Form.Label>
                      <Form.Control
                        defaultValue={formatBN(campaign.hardCap, 18)}
                        onChange={(e) => changeValue(e.target.value, 'hardCap', 'BigNumber')}
                        placeholder="Hard cap"
                        isInvalid={!!errors.hardCap}
                      />
                      {errors.hardCap ? <Form.Control.Feedback>{errors.hardCap}</Form.Control.Feedback> : null}
                    </div>
                    <div className="col-md-6 pr-md-1">
                      <Form.Label>Soft cap</Form.Label>
                      <Form.Control
                        defaultValue={formatBN(campaign.softCap, 18)}
                        onChange={(e) => changeValue(e.target.value, 'softCap', 'BigNumber')}
                        placeholder="Soft cap"
                        isInvalid={!!errors.softCap}
                      />
                      {errors.softCap ? <Form.Control.Feedback>{errors.softCap}</Form.Control.Feedback> : null}
                    </div>
                    <div className="col-md-6 pr-md-1">
                      <Form.Label>Minimum BNB per wallet</Form.Label>
                      <Form.Control
                        defaultValue={formatBN(campaign.minAllowed, 18)}
                        onChange={(e) => changeValue(e.target.value, 'minAllowed', 'BigNumber')}
                        placeholder="Min BNB per wallet"
                        isInvalid={!!errors.minAllowed}
                      />
                      {errors.minAllowed ? <Form.Control.Feedback>{errors.minAllowed}</Form.Control.Feedback> : null}
                    </div>
                    <div className="col-md-6 pr-md-1">
                      <Form.Label>Maximum BNB per wallet</Form.Label>
                      <Form.Control
                        defaultValue={formatBN(campaign.maxAllowed, 18)}
                        onChange={(e) => changeValue(e.target.value, 'maxAllowed', 'BigNumber')}
                        placeholder="Max BNB per wallet"
                        isInvalid={!!errors.maxAllowed}
                      />
                      {errors.maxAllowed ? <Form.Control.Feedback>{errors.maxAllowed}</Form.Control.Feedback> : null}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-8 pr-md-1">
                      <Form.Label>Percentage allocated to PSI Dex</Form.Label>
                      <Form.Control
                        type="range"
                        defaultValue={campaign.liquidityRate ?? 0 / 100}
                        onChange={(e) => {
                          changeValue(e.target.value, 'liquidityRate', 'number')
                        }}
                        isInvalid={!!errors.liquidityRate}
                      />
                      {errors.liquidityRate ? (
                        <Form.Control.Feedback>{errors.liquidityRate}</Form.Control.Feedback>
                      ) : null}
                    </div>
                    <div className="col-md-4 pr-md-1 text-white">
                      <span>{campaign.liquidityRate} %</span>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-md-6 pr-md-1">
                      <Form.Label>Tokens per BNB</Form.Label>
                      <Form.Control
                        defaultValue={formatBN(campaign.rate, token.decimals)}
                        onChange={(e) => changeValue(e.target.value, 'rate', 'BigNumber', true, token.decimals)}
                        placeholder="Token per ETH"
                        isInvalid={!!errors.rate}
                      />
                      {errors.rate ? <Form.Control.Feedback>{errors.rate}</Form.Control.Feedback> : null}
                    </div>
                    <div className="col-md-6 pr-md-1">
                      <Form.Label>Tokens per BNB in liquidity pool</Form.Label>
                      <Form.Control
                        defaultValue={formatBN(campaign.poolRate, token.decimals)}
                        onChange={(e) => changeValue(e.target.value, 'poolRate', 'BigNumber', true, token.decimals)}
                        placeholder="Token per ETH"
                        isInvalid={!!errors.poolRate}
                      />
                      {errors.poolRate ? <Form.Control.Feedback>{errors.poolRate}</Form.Control.Feedback> : null}
                    </div>
                    <div className="col-md-6 pr-md-1">
                      <Form.Label>Liquidity lock duration (in hours)</Form.Label>
                      <Form.Control
                        defaultValue={campaign.lockDuration || ''}
                        onChange={(e) => changeValue(e.target.value, 'lockDuration', 'number')}
                        placeholder="Liquidity lock duration (in hours)"
                        isInvalid={!!errors.lockDuration}
                      />
                      {errors.lockDuration ? (
                        <Form.Control.Feedback>{errors.lockDuration}</Form.Control.Feedback>
                      ) : null}
                    </div>
                    <div className="col-md-6 pr-md-1">
                      <Form.Label>Start date</Form.Label>
                      <Datetime
                        className={errors.startDate ? 'is-invalid' : ''}
                        value={campaign.startDate || ''}
                        onChange={(v) => changeValue(v, 'startDate', 'date')}
                        inputProps={{ placeholder: 'Start date' }}
                      />
                      {errors.startDate ? <Form.Control.Feedback>{errors.startDate}</Form.Control.Feedback> : null}
                    </div>
                    <div className="col-md-6 pr-md-1">
                      <Form.Label>End date</Form.Label>
                      <Datetime
                        className={errors.endDate ? 'is-invalid' : ''}
                        value={campaign.endDate || ''}
                        onChange={(v) => changeValue(v, 'endDate', 'date')}
                        inputProps={{ placeholder: 'End date' }}
                      />
                      {errors.endDate ? <Form.Control.Feedback>{errors.endDate}</Form.Control.Feedback> : null}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <Form.Group>
                        <div className="mb-10 psi-switch custom-control custom-switch">
                          <Form.Check
                            type="checkbox"
                            name="whitelistEnabled"
                            id="whitelistEnabled"
                            className="custom-control-Form.Control"
                            checked={!!campaign.whitelistEnabled}
                            onChange={(e) => changeValue(e.target.checked, 'whitelistEnabled', 'boolean')}
                            isInvalid={!!errors.whitelistEnabled}
                            label="Enable whitelisting"
                          />
                          {/* <Form.Label className="custom-control-Form.Label" htmlFor="whitelistEnabled">
                            {' '}
                            Enable whitelisting{' '}
                          </Form.Label> */}
                        </div>
                        {errors.whitelistEnabled ? (
                          <Form.Control.Feedback>{errors.whitelistEnabled}</Form.Control.Feedback>
                        ) : null}
                      </Form.Group>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-8">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        defaultValue={campaign.description || ''}
                        onChange={(e) => changeValue(e.target.value, 'description', 'text')}
                        rows={4}
                        cols={80}
                        className="form-control"
                        placeholder="Your project description"
                        isInvalid={!!errors.description}
                      />
                      {errors.description ? <Form.Control.Feedback>{errors.description}</Form.Control.Feedback> : null}
                    </div>
                  </div>
                  {/* <button variant="seconday" className="btn" type="submit">
                  Save
                </button> */}
                  {!isApproved ? (
                    <button
                      onClick={onApprove}
                      className="btn btn-primary"
                      type="button"
                      disabled={!valid || approving}
                    >
                      Approve
                    </button>
                  ) : (
                    <button
                      onClick={onCreate}
                      className="btn btn-primary"
                      type="button"
                      disabled={!valid || creatingCampaign}
                    >
                      Launch
                    </button>
                  )}
                </>
              ) : null}
            </Form>
          </Card.Body>
        </Container>
      </Card>
    </div>
  )
}

export default LaunchCampaignForm
