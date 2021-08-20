import React, { useState } from 'react'
import { Label, Input, FormGroup, FormFeedback, FormText } from 'reactstrap'
import { useLoading } from '@agney/react-loading'
import 'react-toastify/dist/ReactToastify.css'
import { TokenCreationInfo } from 'state/types'
import useCreateToken from 'hooks/useCreateToken'
import { isEmpty, isNil } from 'lodash'
import validate from 'utils/validate'

const CreateToken: React.FC = () => {
  const [token, setToken] = useState<Partial<TokenCreationInfo>>({})
  const [valid, setValid] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const { createToken, creatingToken } = useCreateToken()

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateCampaign = (newToken: Partial<TokenCreationInfo>, validateMandatory = false) => {
    if (newToken.initialSupply && newToken.maximumSupply && newToken.initialSupply > newToken.maximumSupply)
      setErrors({ ...errors, maximumSupply: 'Maximum supply should be higher than the initial supply' })

    const mandatoryErrors = valideMandatory(newToken)
    if (validateMandatory) setErrors({ ...errors, ...mandatoryErrors })

    if (isEmpty(errors) && isEmpty(mandatoryErrors)) setValid(true)
    else setValid(false)

    setToken(newToken)
  }

  const valideMandatory = (newToken: Partial<TokenCreationInfo>) => {
    const mandatoryErrors = {}
    if (isNil(newToken.name)) setErrors({ ...mandatoryErrors, name: 'This field is required' })
    if (isNil(newToken.symbol)) setErrors({ ...mandatoryErrors, symbol: 'This field is required' })
    if (isNil(newToken.initialSupply)) setErrors({ ...mandatoryErrors, initialSupply: 'This field is required' })
    if (!termsAccepted) setErrors({ ...mandatoryErrors, termsAccepted: 'Please accept our terms to continue' })
    return mandatoryErrors
  }

  const changeTerms = (event: React.ChangeEvent<HTMLInputElement>) => {
    delete errors.termsAccepted
    setTermsAccepted(event.target.checked)
    if (isEmpty(errors)) setValid(true)
    else setValid(false)
  }

  const changeValue = (value: string | boolean, name: string, type: string, mandatory = true) => {
    const { newValue, newErrors } = validate(token, errors, value, name, type, mandatory)
    setErrors({ ...errors, ...newErrors })
    validateCampaign(newValue)
  }

  const onCreate = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    validateCampaign(token, true)
    if (isEmpty(errors)) {
      createToken(token)
    }
  }

  const { containerProps, indicatorEl } = useLoading({
    loading: creatingToken,
  })

  return (
    <div className="content">
      <div className="row">
        <div className="col-md-12">
          <div className="card" {...containerProps}>
            {indicatorEl}
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
                          value={token.initialSupply.toFormat(18)}
                          onChange={(e) => changeValue(e.target.value, 'initialSupply', 'BigNumber')}
                          placeholder="Initial supply"
                          invalid={!!errors.initialSupply}
                        />
                        {errors.initialSupply ? <FormFeedback>{errors.initialSupply}</FormFeedback> : null}
                      </FormGroup>
                    </div>
                  </div>

                  <h5 className="title">Token features</h5>

                  <div className="row">
                    <div className="col-lg-6">
                      <FormGroup check>
                        <Label check>
                          <Input
                            type="checkbox"
                            name="burnable"
                            id="burnable"
                            checked={token.burnable}
                            onChange={(e) => changeValue(e.target.checked, 'burnable', 'boolean')}
                            invalid={!!errors.burnable}
                          />{' '}
                          Burnable
                        </Label>
                        {errors.burnable ? <FormFeedback>{errors.burnable}</FormFeedback> : null}
                      </FormGroup>
                    </div>
                    <div className="col-lg-6">
                      <FormGroup check>
                        <Label check>
                          <Input
                            type="checkbox"
                            name="mintable"
                            id="mintable"
                            checked={token.mintable}
                            onChange={(e) => changeValue(e.target.checked, 'mintable', 'boolean')}
                            invalid={!!errors.mintable}
                          />{' '}
                          Mintable
                        </Label>
                        {errors.mintable ? <FormFeedback>{errors.mintable}</FormFeedback> : null}
                      </FormGroup>
                    </div>
                    <div className="col-lg-6">
                      <FormGroup>
                        <Label for="maximumSupply">Maximum supply</Label>
                        <Input
                          type="number"
                          name="maximumSupply"
                          id="maximumSupply"
                          value={token.maximumSupply.toFormat(18)}
                          onChange={(e) => changeValue(e.target.value, 'maximumSupply', 'BigNumber')}
                          placeholder="Maximum supply"
                          invalid={!!errors.maximumSupply}
                        />
                        {errors.maximumSupply ? <FormFeedback>{errors.maximumSupply}</FormFeedback> : null}
                        <FormText>
                          When the token is mintable, a maximum supply could be set to ensure that it&apos;s impossible
                          to mint more tokens than configureds
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
                          Delay in hours when a new minter is added. After the delay has ended, the owner also needs to
                          approve the new minter. This delay is not changeable.
                        </FormText>
                      </FormGroup>
                    </div>
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

                  <div className="mb-10 psi-switch custom-control custom-switch">
                    <FormGroup check>
                      <Label check>
                        <Input
                          type="checkbox"
                          name="termsAccepted"
                          id="termsAccepted"
                          checked={termsAccepted}
                          onChange={changeTerms}
                          invalid={!!errors.termsAccepted}
                        />{' '}
                        I have read, understood and agreed to PSI Terms of Use. Use at your own risk.
                      </Label>
                      {errors.mintable ? <FormFeedback>{errors.mintable}</FormFeedback> : null}
                    </FormGroup>
                  </div>

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
