import React, { useState, useMemo } from 'react'
import moment from 'moment'
import { Form } from 'react-bootstrap'
import Datetime from 'react-datetime'
import { useCreateTokenLock, useTokenLockFactoryApproval } from 'hooks/useTokenLock'
import { TokenLock } from 'state/types'
import { isEmpty, isNil, round } from 'lodash'
import validate from 'utils/validate'
import { formatBN } from 'utils/formatters'
import { useGlobalLoader } from 'components/Loader'
import { BigNumber } from '@ethersproject/bignumber'
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

  const amountRange = useMemo(() => {
    if (!token?.accountBalance || !lock.amount) return 0
    return round(
      (parseFloat(formatBN(lock.amount, token?.decimals)) /
        parseFloat(formatBN(token.accountBalance, token?.decimals))) *
        100,
      1,
    )
  }, [token, lock.amount])

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const changeValue = (
    value: string | moment.Moment,
    name: string,
    type: string,
    mandatory = true,
    extra: any = undefined,
  ) => {
    const { newValue, newErrors } = validate(lock, validationErrors, value, name, type, mandatory, extra)
    setValidationErrors(newErrors)
    setLock(newValue)
  }

  const changeRange = (value: string, name: string, type: string, mandatory = true, extra: any = undefined) => {
    const rangeValue = Math.ceil((!Number.isNaN(parseFloat(value)) ? parseFloat(value) : 0) * 100)
    const amount =
      rangeValue === 0
        ? BigNumber.from('0')
        : rangeValue >= 10000
        ? token.accountBalance
        : token.accountBalance.mul(rangeValue).div(10000)
    changeValue(formatBN(amount, token?.decimals), name, type, mandatory, extra)
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
  useGlobalLoader(loading)

  return (
    <div className="content">
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
                      <Form.Group>
                        <Form.Label htmlFor="tokenaddress">Token address:</Form.Label>
                        <Form.Control
                          type="text"
                          defaultValue={lock.token}
                          onChange={(e) => changeValue(e.target.value, 'token', 'address')}
                          placeholder="Enter token address"
                          isInvalid={!!errors.tokenAddress}
                        />
                        {errors.tokenAddress ? (
                          <Form.Control.Feedback>{errors.tokenAddress}</Form.Control.Feedback>
                        ) : null}
                        {!isEmpty(token) ? (
                          <Form.Text>
                            {token.name} - {formatBN(token.totalSupply, token.decimals)} {token.symbol}
                          </Form.Text>
                        ) : null}
                      </Form.Group>
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
                          <Form.Label htmlFor="tokenname">Token Name:</Form.Label>
                          <h5>{token.name}</h5>
                        </div>
                        <div className="m-2">
                          <Form.Label htmlFor="tokensupply">Total Supply:</Form.Label>
                          <h5>
                            {formatBN(token.totalSupply, token.decimals)} {token.symbol}
                          </h5>
                        </div>
                        <div className="m-2">
                          <Form.Label htmlFor="accountBalance">Token Balance:</Form.Label>
                          <h5>
                            {formatBN(token.accountBalance, token.decimals)} {token.symbol}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6 offset-lg-3">
                      <Form.Group>
                        <Form.Label>Start time</Form.Label>
                        <Datetime
                          className={errors.startTime ? 'is-invalid' : ''}
                          value={lock.startTime}
                          onChange={(v) => changeValue(v, 'startTime', 'date')}
                          inputProps={{ placeholder: 'Start time' }}
                        />
                        {errors.startTime ? <Form.Control.Feedback>{errors.startTime}</Form.Control.Feedback> : null}
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>Unlock time</Form.Label>
                        <Datetime
                          className={errors.unlockTime ? 'is-invalid' : ''}
                          value={lock.unlockTime}
                          onChange={(v) => changeValue(v, 'unlockTime', 'date')}
                          inputProps={{ placeholder: 'Unlock time' }}
                        />
                        {errors.unlockTime ? <Form.Control.Feedback>{errors.unlockTime}</Form.Control.Feedback> : null}
                      </Form.Group>

                      <Form.Group>
                        <Form.Label for="releases">Number of releases (default 1)</Form.Label>
                        <Form.Control
                          type="number"
                          name="releases"
                          id="releases"
                          defaultValue={lock.releases}
                          onChange={(e) => changeValue(e.target.value, 'releases', 'number')}
                          placeholder="1"
                          isInvalid={!!errors.releases}
                        />
                        {errors.releases ? <Form.Control.Feedback>{errors.releases}</Form.Control.Feedback> : null}
                      </Form.Group>

                      <Form.Group>
                        <Form.Label for="amount">Amount of tokens</Form.Label>
                        <Form.Control
                          type="range"
                          name="amount"
                          id="amount"
                          value={amountRange > 100 ? 100 : amountRange ?? 0}
                          onChange={(e) => changeRange(e.target.value, 'amount', 'BigNumber', true, token.decimals)}
                          isInvalid={!!errors.amount}
                          min={0}
                          max={100}
                          step={0.1}
                        />
                        <br />
                        <Form.Control
                          type="number"
                          name="amount"
                          id="amount"
                          value={formatBN(lock?.amount)}
                          onChange={(e) => changeValue(e.target.value, 'amount', 'BigNumber', true, token.decimals)}
                          placeholder="0"
                          isInvalid={!!errors.amount}
                        />
                        {errors.amount ? <Form.Control.Feedback>{errors.amount}</Form.Control.Feedback> : null}
                      </Form.Group>

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
