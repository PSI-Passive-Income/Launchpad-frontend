import React, { useState, useMemo } from 'react'
import { Form } from 'react-bootstrap'
import 'react-toastify/dist/ReactToastify.css'
import { TokenCreationInfo } from 'state/types'
import useCreateToken from 'hooks/useCreateToken'
import { isEmpty, isNil } from 'lodash'
import validate from 'utils/validate'
import { formatBN } from 'utils/formatters'
import { useGlobalLoader } from 'components/Loader'

const CreateToken: React.FC = () => {
  const [token, setToken] = useState<Partial<TokenCreationInfo>>({})
  const [termsAccepted, setTermsAccepted] = useState(false)

  const [submitClicked, setSubmitClicked] = useState(false)
  const { createToken, creatingToken } = useCreateToken()

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const changeValue = (value: string | boolean, name: string, type: string, mandatory = true) => {
    const { newValue, newErrors } = validate(token, validationErrors, value, name, type, mandatory)
    setValidationErrors(newErrors)
    setToken(newValue)
  }

  const mandatoryErrors = useMemo(() => {
    const _errors: { [key: string]: string } = {}
    if (isEmpty(token.name)) _errors.name = 'This field is required'
    if (isEmpty(token.symbol)) _errors.symbol = 'This field is required'
    if (isNil(token.initialSupply) || token.initialSupply.lte(0)) _errors.initialSupply = 'This field is required'
    if (!termsAccepted) _errors.termsAccepted = 'Please accept our terms to continue'
    return _errors
  }, [token, termsAccepted])

  const errors: { [key: string]: string } = useMemo(() => {
    const _errors = { ...(submitClicked ? mandatoryErrors : {}), ...validationErrors }

    if (token.initialSupply && token.maximumSupply && token.initialSupply.gt(token.maximumSupply))
      _errors.maximumSupply = 'Maximum supply should be higher than the initial supply'

    return _errors
  }, [validationErrors, submitClicked, mandatoryErrors, token])

  const valid = useMemo(() => isEmpty(errors) && isEmpty(mandatoryErrors), [errors, mandatoryErrors])

  const changeTerms = (event: React.ChangeEvent<HTMLInputElement>) => {
    delete errors.termsAccepted
    setTermsAccepted(event.target.checked)
  }

  const onCreate = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    if (!submitClicked) setSubmitClicked(true)
    if (valid) {
      createToken(token)
    }
  }

  useGlobalLoader(creatingToken)

  return (
    <div className="content">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h4 className="title">Create Token</h4>
              <hr />
            </div>
            <div className="card-body pt-0">
              <div className="row">
                <div className="col-md-8 pr-md-1">
                  <h5 className="title">Token details</h5>
                  <div className="row mb-3">
                    <div className="col-lg-6">
                      <Form.Group>
                        <Form.Label for="name">Token name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          id="name"
                          defaultValue={token.name}
                          onChange={(e) => changeValue(e.target.value, 'name', 'text')}
                          placeholder="Token name"
                          isInvalid={!!errors.name}
                        />
                        {errors.name ? (
                          <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                        ) : null}
                      </Form.Group>
                    </div>
                    <div className="col-lg-6">
                      <Form.Group>
                        <Form.Label for="symbol">Token symbol</Form.Label>
                        <Form.Control
                          type="text"
                          name="symbol"
                          id="symbol"
                          defaultValue={token.symbol}
                          onChange={(e) => changeValue(e.target.value, 'symbol', 'text')}
                          placeholder="Token symbol"
                          isInvalid={!!errors.symbol}
                        />
                        {errors.symbol ? (
                          <Form.Control.Feedback type="invalid">{errors.symbol}</Form.Control.Feedback>
                        ) : null}
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-lg-6">
                      <Form.Group>
                        <Form.Label for="initialSupply">Initial supply</Form.Label>
                        <Form.Control
                          type="number"
                          name="initialSupply"
                          id="initialSupply"
                          defaultValue={formatBN(token.initialSupply, 18)}
                          onChange={(e) => changeValue(e.target.value, 'initialSupply', 'BigNumber')}
                          placeholder="Initial supply"
                          isInvalid={!!errors.initialSupply}
                        />
                        {errors.initialSupply ? (
                          <Form.Control.Feedback type="invalid">{errors.initialSupply}</Form.Control.Feedback>
                        ) : null}
                      </Form.Group>
                    </div>
                  </div>

                  <hr className="mt-4" />

                  <h5 className="title">Token features</h5>

                  <div className="row mb-3">
                    <div className="col-lg-6">
                      <Form.Group>
                        <Form.Switch
                          name="burnable"
                          id="burnable"
                          defaultChecked={token.burnable}
                          onChange={(e) => changeValue(e.target.checked, 'burnable', 'boolean')}
                          isInvalid={!!errors.burnable}
                          label="Burnable"
                        />
                        {errors.burnable ? (
                          <Form.Control.Feedback type="invalid">{errors.burnable}</Form.Control.Feedback>
                        ) : null}
                      </Form.Group>
                    </div>
                    <div className="col-lg-6">
                      <Form.Group>
                        <Form.Switch
                          name="mintable"
                          id="mintable"
                          defaultChecked={token.mintable}
                          onChange={(e) => changeValue(e.target.checked, 'mintable', 'boolean')}
                          isInvalid={!!errors.mintable}
                          label="Mintable"
                        />
                        {errors.mintable ? (
                          <Form.Control.Feedback type="invalid">{errors.mintable}</Form.Control.Feedback>
                        ) : null}
                      </Form.Group>
                    </div>
                  </div>

                  {token.mintable ? (
                    <div className="row mb-3">
                      <div className="col-lg-6">
                        <Form.Group>
                          <Form.Label for="maximumSupply">Maximum supply</Form.Label>
                          <Form.Control
                            type="number"
                            name="maximumSupply"
                            id="maximumSupply"
                            defaultValue={formatBN(token.maximumSupply, 18)}
                            onChange={(e) => changeValue(e.target.value, 'maximumSupply', 'BigNumber')}
                            placeholder="Maximum supply"
                            isInvalid={!!errors.maximumSupply}
                          />
                          {errors.maximumSupply ? (
                            <Form.Control.Feedback type="invalid">{errors.maximumSupply}</Form.Control.Feedback>
                          ) : null}
                          <Form.Text muted>
                            When the token is mintable, a maximum supply could be set to ensure that it&apos;s
                            impossible to mint more tokens than configureds
                          </Form.Text>
                        </Form.Group>
                      </div>
                      <div className="col-lg-6">
                        <Form.Group>
                          <Form.Label for="minterDelay">Add minter delay</Form.Label>
                          <Form.Control
                            type="number"
                            name="minterDelay"
                            id="minterDelay"
                            defaultValue={token.minterDelay}
                            onChange={(e) => changeValue(e.target.value, 'minterDelay', 'number')}
                            placeholder="Minter delay"
                            isInvalid={!!errors.minterDelay}
                          />
                          {errors.minterDelay ? (
                            <Form.Control.Feedback type="invalid">{errors.minterDelay}</Form.Control.Feedback>
                          ) : null}
                          <Form.Text muted>
                            Delay in hours when a new minter is added. After the delay has ended, the owner also needs
                            to approve the new minter. This delay is not changeable.
                          </Form.Text>
                        </Form.Group>
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-4">
                    <h5 className="title red">Important points:</h5>
                    <ul>
                      <li>Choose a unique token name</li>
                    </ul>
                  </div>
                </div>

                <div className="col-md-4 pr-md-1">
                  <h5 className="title">Network and Transaction: Binance Smart Chain (BSC)</h5>

                  <Form.Group>
                    <Form.Check
                      name="termsAccepted"
                      id="termsAccepted"
                      className="custom-control-input"
                      defaultChecked={termsAccepted}
                      onChange={changeTerms}
                      isInvalid={!!errors.termsAccepted}
                      label="I have read, understood and agreed to PSI Terms of Use. Use at your own risk."
                    />
                    {errors.termsAccepted ? (
                      <Form.Control.Feedback type="invalid">{errors.termsAccepted}</Form.Control.Feedback>
                    ) : null}
                  </Form.Group>

                  <p className="mt-3">Commission Fee: Free (Promotion active)</p>
                  <p className="mt-3">Gas Fee: Variable</p>

                  <button type="button" className="btn btn-primary mt-3" disabled={!valid} onClick={onCreate}>
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateToken
