import React, { useState, useMemo } from 'react'
import { Label, Input, FormGroup, FormFeedback, FormText } from 'reactstrap'
import 'react-toastify/dist/ReactToastify.css'
import { TokenCreationInfo } from 'state/types'
import useCreateToken from 'hooks/useCreateToken'
import { isEmpty, isNil } from 'lodash'
import validate from 'utils/validate'
import { formatBN } from 'utils/formatters'
import Loader from 'components/Loader'

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

  return (
    <div className="content">
      <Loader loading={creatingToken} />

      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5 className="title">Create Token</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-8 pr-md-1">
                  <h5 className="title">Token details</h5>
                  <div className="row">
                    <div className="col-lg-6">
                      <FormGroup>
                        <Label for="name">Token name</Label>
                        <Input
                          type="text"
                          name="name"
                          id="name"
                          value={token.name}
                          onChange={(e) => changeValue(e.target.value, 'name', 'text')}
                          placeholder="Token name"
                          invalid={!!errors.name}
                        />
                        {errors.name ? <FormFeedback>{errors.name}</FormFeedback> : null}
                      </FormGroup>
                    </div>
                    <div className="col-lg-6">
                      <FormGroup>
                        <Label for="symbol">Token symbol</Label>
                        <Input
                          type="text"
                          name="symbol"
                          id="symbol"
                          value={token.symbol}
                          onChange={(e) => changeValue(e.target.value, 'symbol', 'text')}
                          placeholder="Token symbol"
                          invalid={!!errors.symbol}
                        />
                        {errors.symbol ? <FormFeedback>{errors.symbol}</FormFeedback> : null}
                      </FormGroup>
                    </div>
                    <div className="col-lg-6">
                      <FormGroup>
                        <Label for="initialSupply">Initial supply</Label>
                        <Input
                          type="number"
                          name="initialSupply"
                          id="initialSupply"
                          value={formatBN(token.initialSupply, 18, true)}
                          onChange={(e) => changeValue(e.target.value, 'initialSupply', 'BigNumber')}
                          placeholder="Initial supply"
                          invalid={!!errors.initialSupply}
                        />
                        {errors.initialSupply ? <FormFeedback>{errors.initialSupply}</FormFeedback> : null}
                      </FormGroup>
                    </div>
                  </div>

                  <hr />

                  <h5 className="title">Token features</h5>

                  <div className="row">
                    <div className="col-lg-6">
                      <FormGroup check>
                        <div className="mb-10 psi-switch custom-control custom-switch">
                          <Input
                            type="checkbox"
                            name="burnable"
                            id="burnable"
                            className="custom-control-input"
                            checked={token.burnable}
                            onChange={(e) => changeValue(e.target.checked, 'burnable', 'boolean')}
                            invalid={!!errors.burnable}
                          />
                          <Label className="custom-control-label" htmlFor="burnable">
                            {' '}
                            Burnable{' '}
                          </Label>
                        </div>
                        {errors.burnable ? <FormFeedback>{errors.burnable}</FormFeedback> : null}
                      </FormGroup>
                    </div>
                    <div className="col-lg-6">
                      <FormGroup check>
                        <div className="mb-10 psi-switch custom-control custom-switch">
                          <Input
                            type="checkbox"
                            name="mintable"
                            id="mintable"
                            className="custom-control-input"
                            checked={token.mintable}
                            onChange={(e) => changeValue(e.target.checked, 'mintable', 'boolean')}
                            invalid={!!errors.mintable}
                          />
                          <Label className="custom-control-label" htmlFor="mintable">
                            {' '}
                            Mintable{' '}
                          </Label>
                        </div>
                        {errors.mintable ? <FormFeedback>{errors.mintable}</FormFeedback> : null}
                      </FormGroup>
                    </div>

                    {token.mintable ? (
                      <>
                        <div className="col-lg-6">
                          <FormGroup>
                            <Label for="maximumSupply">Maximum supply</Label>
                            <Input
                              type="number"
                              name="maximumSupply"
                              id="maximumSupply"
                              value={formatBN(token.maximumSupply, 18, true)}
                              onChange={(e) => changeValue(e.target.value, 'maximumSupply', 'BigNumber')}
                              placeholder="Maximum supply"
                              invalid={!!errors.maximumSupply}
                            />
                            {errors.maximumSupply ? <FormFeedback>{errors.maximumSupply}</FormFeedback> : null}
                            <FormText>
                              When the token is mintable, a maximum supply could be set to ensure that it&apos;s
                              impossible to mint more tokens than configureds
                            </FormText>
                          </FormGroup>
                        </div>
                        <div className="col-lg-6">
                          <FormGroup>
                            <Label for="minterDelay">Add minter delay</Label>
                            <Input
                              type="number"
                              name="minterDelay"
                              id="minterDelay"
                              value={token.minterDelay}
                              onChange={(e) => changeValue(e.target.value, 'minterDelay', 'number')}
                              placeholder="Minter delay"
                              invalid={!!errors.minterDelay}
                            />
                            {errors.minterDelay ? <FormFeedback>{errors.minterDelay}</FormFeedback> : null}
                            <FormText>
                              Delay in hours when a new minter is added. After the delay has ended, the owner also needs
                              to approve the new minter. This delay is not changeable.
                            </FormText>
                          </FormGroup>
                        </div>
                      </>
                    ) : null}
                  </div>

                  <div className="mt-5">
                    <h5 className="title red">Important points:</h5>
                    <ul>
                      <li>Choose a unique token name</li>
                    </ul>
                  </div>
                </div>

                <div className="col-md-4 pr-md-1">
                  <h5 className="title">Network and Transaction: Binance Smart Chain (BSC)</h5>

                  <FormGroup check>
                    <div className="mb-10 psi-switch custom-control custom-switch">
                      <Input
                        type="checkbox"
                        name="termsAccepted"
                        id="termsAccepted"
                        className="custom-control-input"
                        checked={termsAccepted}
                        onChange={changeTerms}
                        invalid={!!errors.termsAccepted}
                      />
                      <Label className="custom-control-label" htmlFor="termsAccepted">
                        {' '}
                        I have read, understood and agreed to PSI Terms of Use. Use at your own risk.{' '}
                      </Label>
                    </div>
                    {errors.termsAccepted ? <FormFeedback>{errors.termsAccepted}</FormFeedback> : null}
                  </FormGroup>

                  <p> Commission Fee: Free (Promotion active) </p>
                  <p> Gas Fee: Variable </p>

                  <button type="button" className="btn btn-primary" slot="footer" disabled={!valid} onClick={onCreate}>
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
