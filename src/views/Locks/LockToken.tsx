import React, { useState, useMemo } from 'react'
import { Moment } from 'moment'
import { FormFeedback, FormGroup, FormText, Input, Label } from 'reactstrap'
import Datetime from 'react-datetime'
import { useCreateTokenLock, useTokenLockFactoryApproval } from 'hooks/useTokenLock'
import { TokenLock } from 'state/types'
import { isEmpty, isNil, round, toFinite } from 'lodash'
import validate from 'utils/validate'
import { formatBN } from 'utils/formatters'
import Loader from 'components/Loader'
import Releases from './components/Releases'

const LockToken: React.FC = () => {
  const [lock, setLock] = useState<Partial<TokenLock>>({})
  const [valid, setValid] = useState(false)

  const { createLock, creatingLock } = useCreateTokenLock()

  const { token, isLoadingToken, approve, approving, approvedAmount } = useTokenLockFactoryApproval(lock.token)

  const isApproved = useMemo(
    () => lock.amount && approvedAmount && approvedAmount.gte(lock.amount),
    [lock.amount, approvedAmount],
  )

  const amountRange = useMemo(
    () => (token.accountBalance && lock.amount ? round(token.accountBalance.div(lock.amount).toNumber(), 1) : 0),
    [token.accountBalance, lock.amount],
  )

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateCampaign = (newLock: Partial<TokenLock>, validateMandatory = false) => {
    if (newLock.startTime && newLock.unlockTime && newLock.startTime >= newLock.unlockTime)
      setErrors({ ...errors, unlockTime: 'Unlock should be later than the start' })
    if (newLock.unlockTime && newLock.unlockTime.getTime() > Date.now())
      setErrors({ ...errors, unlockTime: 'Unlock should be later than the current time' })
    if (newLock.amount && token?.totalSupply && newLock.amount.gt(token?.totalSupply))
      setErrors({ ...errors, amount: 'The amount to lock is more than the total supply' })
    if (newLock.releases && newLock.releases < 1) setErrors({ ...errors, rate: 'A minimum of 1 release is mandatory' })

    const mandatoryErrors = valideMandatory(newLock)
    if (validateMandatory) setErrors({ ...errors, ...mandatoryErrors })

    if (isEmpty(errors) && isEmpty(mandatoryErrors)) setValid(true)
    else setValid(false)

    setLock(newLock)
  }

  const valideMandatory = (newLock: Partial<TokenLock>) => {
    const mandatoryErrors = {}
    if (isNil(newLock.token)) setErrors({ ...mandatoryErrors, token: 'This field is required' })
    if (isNil(newLock.amount)) setErrors({ ...mandatoryErrors, amount: 'This field is required' })
    if (isNil(newLock.startTime)) setErrors({ ...mandatoryErrors, startTime: 'This field is required' })
    if (isNil(newLock.unlockTime)) setErrors({ ...mandatoryErrors, unlockTime: 'This field is required' })
    if (isNil(newLock.releases)) setErrors({ ...mandatoryErrors, releases: 'This field is required' })
    return mandatoryErrors
  }

  const changeValue = (value: string | Moment, name: string, type: string, mandatory = true) => {
    const { newValue, newErrors } = validate(lock, errors, value, name, type, mandatory)
    setErrors({ ...errors, ...newErrors })
    validateCampaign(newValue)
  }

  const changeRange = (value: string, name: string, type: string, mandatory = true) => {
    const range = toFinite(value)
    const amount = token.accountBalance.multipliedBy(range)
    changeValue(amount.toString(), name, type, mandatory)
  }

  const onApprove = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    approve()
  }

  const onCreate = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    validateCampaign(lock, true)
    if (isEmpty(errors)) {
      if (isNil(lock.releases)) lock.releases = 1
      lock.duration = lock.unlockTime.getTime() - lock.startTime.getTime()
      createLock(lock)
    }
  }

  const loading = isLoadingToken || approving || creatingLock

  return (
    <div className="content">
      <Loader loading={loading} />

      <div className="row">
        <div className="col-md-12">
          <div className="card">

            <div className="card-header">
              <h5 className="title">Lock or Manage Tokens</h5>
            </div>
            <div className="card-body">
              <p className="text-center">
                Use the PsiLock Token Locker to lock your tokens and earn greater trust within your community!
              </p>

              <div className="row">
                <div className="col-lg-6 offset-lg-3">
                  <div className="card mt-5">
                    <div className="card-body">
                      <FormGroup>
                        <Label htmlFor="tokenaddress">Token address:</Label>
                        <Input
                          type="text"
                          value={lock.token}
                          onChange={(e) => changeValue(e.target.value, 'token', 'address')}
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
                      </FormGroup>
                    </div>
                  </div>
                </div>
              </div>
              {!isNil(token) && !isNil(token.accountBalance) ? (
                <>
                  <div className="row">
                    <div className="col-lg-12">
                      <h5 className="text-center">Token Information</h5>

                      <div className="token-info-box d-flex justify-content-center">
                        <div className="m-2">
                          <Label htmlFor="tokenname">Token Name:</Label>
                          <h5>{token.name}</h5>
                        </div>
                        <div className="m-2">
                          <Label htmlFor="tokensupply">Total Supply:</Label>
                          <h5>
                            {formatBN(token.totalSupply)} {token.symbol}
                          </h5>
                        </div>
                        <div className="m-2">
                          <Label htmlFor="accountBalance">Token Balance:</Label>
                          <h5>
                            {formatBN(token.accountBalance)} {token.symbol}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6 offset-lg-3">
                      <FormGroup>
                        <Label>Start time</Label>
                        <Datetime
                          className="form-control"
                          value={lock.startTime}
                          onChange={(v) => changeValue(v, 'startTime', 'date')}
                          input={false}
                          inputProps={{ placeholder: 'Start time' }}
                        />
                        {errors.startDate ? <FormFeedback>{errors.startDate}</FormFeedback> : null}
                      </FormGroup>

                      <FormGroup>
                        <Label>Unlock time</Label>
                        <Datetime
                          className="form-control"
                          value={lock.unlockTime}
                          onChange={(v) => changeValue(v, 'unlockTime', 'date')}
                          input={false}
                          inputProps={{ placeholder: 'Unlock time' }}
                        />
                        {errors.unlockTime ? <FormFeedback>{errors.unlockTime}</FormFeedback> : null}
                      </FormGroup>

                      <FormGroup>
                        <Label for="releases">Number of releases (default 1)</Label>
                        <Input
                          type="number"
                          name="releases"
                          id="releases"
                          value={lock.releases}
                          onChange={(e) => changeValue(e.target.value, 'releases', 'BigNumber')}
                          placeholder="1"
                          invalid={!!errors.releases}
                        />
                        {errors.releases ? <FormFeedback>{errors.releases}</FormFeedback> : null}
                      </FormGroup>

                      <FormGroup>
                        <Label for="amount">Amount of tokens</Label>
                        <Input
                          type="range"
                          name="amount"
                          id="amount"
                          value={amountRange > 100 ? 100 : amountRange}
                          onChange={(e) => changeRange(e.target.value, 'amount', 'BigNumber')}
                          invalid={!!errors.amount}
                          min={0}
                          max={100}
                          step={0.1}
                        />
                        <Input
                          type="number"
                          name="amount"
                          id="amount"
                          value={lock.amount?.toFormat(18)}
                          onChange={(e) => changeValue(e.target.value, 'amount', 'BigNumber')}
                          placeholder="0"
                          invalid={!!errors.amount}
                        />
                        {errors.amount ? <FormFeedback>{errors.amount}</FormFeedback> : null}
                      </FormGroup>

                      {valid ? <Releases lock={lock} /> : null}

                      <div className="text-center mt-5">
                        {isApproved ? (
                          <button type="button" className="btn btn-primary" disabled={!valid} onClick={onCreate}>
                            Submit
                          </button>
                        ) : (
                          <button type="button" className="btn btn-primary" disabled={!valid} onClick={onApprove}>
                            Approve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default LockToken
