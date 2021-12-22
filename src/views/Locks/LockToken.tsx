import React, { useState, useMemo } from 'react'
import moment from 'moment'
import { FormFeedback, FormGroup, FormText, Input, Label } from 'reactstrap'
import Datetime from 'react-datetime'
import { useCreateTokenLock, useTokenLockFactoryApproval } from 'hooks/useTokenLock'
import { TokenLock } from 'state/types'
import { isEmpty, isNil, round } from 'lodash'
import validate from 'utils/validate'
import { formatBN } from 'utils/formatters'
import Loader from 'components/Loader'
import { parseEther } from '@ethersproject/units'
import Releases from './components/Releases'

const LockToken: React.FC = () => {
  const [lock, setLock] = useState<Partial<TokenLock>>({})

  const [submitClicked, setSubmitClicked] = useState(false)
  const { createLock, creatingLock } = useCreateTokenLock()

  const { token, isLoadingToken, approve, approving, approvedAmount } = useTokenLockFactoryApproval(lock.token)

  const isApproved = useMemo(
    () => lock.amount && approvedAmount && approvedAmount.gte(lock.amount),
    [lock.amount, approvedAmount],
  )

  const amountRange = useMemo(
    () => (token?.accountBalance && lock.amount ? round(lock.amount.div(token.accountBalance).toNumber() * 100, 1) : 0),
    [token, lock.amount],
  )

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const changeValue = (value: string | moment.Moment, name: string, type: string, mandatory = true, extra?: any) => {
    const { newValue, newErrors } = validate(lock, validationErrors, value, name, type, mandatory, extra)
    setValidationErrors(newErrors)
    setLock(newValue)
  }

  const changeRange = (value: string, name: string, type: string, mandatory = true, extra?: any) => {
    const rangeValue = (!Number.isNaN(parseFloat(value)) ? parseFloat(value) : 0) / 100
    const amount = token.accountBalance.mul(rangeValue).div(parseEther('10'))
    changeValue(amount.toString(), name, type, mandatory, extra)
  }

  const mandatoryErrors = useMemo(() => {
    const _errors: { [key: string]: string } = {}
    if (isEmpty(lock.token)) _errors.token = 'This field is required'
    if (isNil(lock.amount) || lock.amount.lte(0)) _errors.amount = 'This field is required'
    if (isNil(lock.startTime)) _errors.startTime = 'This field is required'
    if (isNil(lock.unlockTime)) _errors.unlockTime = 'This field is required'
    if (isNil(lock.releases) || lock.releases <= 0) _errors.releases = 'This field is required'
    return _errors
  }, [lock])

  const errors: { [key: string]: string } = useMemo(() => {
    const _errors = { ...(submitClicked ? mandatoryErrors : {}), ...validationErrors }

    if (lock.startTime && lock.unlockTime && lock.startTime >= lock.unlockTime)
      _errors.unlockTime = 'Unlock should be later than the start'
    if (lock.unlockTime && lock.unlockTime.getTime() <= Date.now())
      _errors.unlockTime = 'Unlock should be later than the current time'
    if (lock.amount && token?.totalSupply && lock.amount.gt(token?.totalSupply))
      _errors.amount = 'The amount to lock is more than the total supply'
    if (lock.releases && lock.releases < 1) _errors.rate = 'A minimum of 1 release is mandatory'

    return _errors
  }, [validationErrors, submitClicked, mandatoryErrors, lock, token?.totalSupply])

  const valid = useMemo(() => isEmpty(errors) && isEmpty(mandatoryErrors), [errors, mandatoryErrors])

  const onApprove = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    approve()
  }

  const onCreate = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    if (!submitClicked) setSubmitClicked(true)
    if (valid) {
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
                          defaultValue={lock.token}
                          onChange={(e) => changeValue(e.target.value, 'token', 'address')}
                          label="Token Address"
                          placeholder="Enter token address"
                          invalid={!!errors.tokenAddress}
                        />
                        {errors.tokenAddress ? <FormFeedback>{errors.tokenAddress}</FormFeedback> : null}
                        {!isEmpty(token) ? (
                          <FormText>
                            {token.name} - {formatBN(token.totalSupply, token.decimals)} {token.symbol}
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
                            {formatBN(token.totalSupply, token.decimals)} {token.symbol}
                          </h5>
                        </div>
                        <div className="m-2">
                          <Label htmlFor="accountBalance">Token Balance:</Label>
                          <h5>
                            {formatBN(token.accountBalance, token.decimals)} {token.symbol}
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
                          className={errors.startTime ? 'is-invalid' : ''}
                          value={lock.startTime}
                          onChange={(v) => changeValue(v, 'startTime', 'date')}
                          inputProps={{ placeholder: 'Start time' }}
                        />
                        {errors.startTime ? <FormFeedback>{errors.startTime}</FormFeedback> : null}
                      </FormGroup>

                      <FormGroup>
                        <Label>Unlock time</Label>
                        <Datetime
                          className={errors.unlockTime ? 'is-invalid' : ''}
                          value={lock.unlockTime}
                          onChange={(v) => changeValue(v, 'unlockTime', 'date')}
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
                          defaultValue={lock.releases}
                          onChange={(e) => changeValue(e.target.value, 'releases', 'number')}
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
                          onChange={(e) => changeRange(e.target.value, 'amount', 'BigNumber', true, token.decimals)}
                          invalid={!!errors.amount}
                          min={0}
                          max={100}
                          step={0.1}
                        />
                        <br />
                        <Input
                          type="number"
                          name="amount"
                          id="amount"
                          value={lock.amount?.div(parseEther('10')).toNumber()}
                          onChange={(e) => changeValue(e.target.value, 'amount', 'BigNumber', true, token.decimals)}
                          placeholder="0"
                          invalid={!!errors.amount}
                        />
                        {errors.amount ? <FormFeedback>{errors.amount}</FormFeedback> : null}
                      </FormGroup>

                      {valid ? <Releases lock={lock} token={token} /> : null}

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
