import React, { useState, useMemo } from 'react'
import { Input, Button, FormGroup, FormFeedback } from 'react-bootstrap'
import { isEmpty } from 'lodash'
import validate from 'utils/validate'
import { GoogleLogin } from 'react-google-login'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { FACEBOOK_APP_ID, GOOGLE_CLIEND_ID } from 'config/constants/misc'
import { loginDataInfo } from 'state/types'
import { useUserEmail } from '../../state/hooks'
import facebook from '../../assets/img/icons/facebook.png'
import google from '../../assets/img/icons/google-plus.png'

const UserLogin: React.FC = () => {
  const { signUp, userLogin } = useUserEmail()

  const [login, setlogin] = useState<Partial<loginDataInfo>>({})
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})

  const [submitClicked, setSubmitClicked] = useState(false)

  const changeValue = (value: string | boolean, name: string, type: string, mandatory = true) => {
    const { newValue, newErrors } = validate(login, validationErrors, value, name, type, mandatory)
    setValidationErrors(newErrors)
    setlogin(newValue)
  }

  const mandatoryErrors = useMemo(() => {
    const _errors: { [key: string]: string } = {}
    if (isEmpty(login.email)) _errors.email = 'This field is required'
    if (isEmpty(login.password)) _errors.password = 'This field is required'

    return _errors
  }, [login])

  const errors: { [key: string]: string } = useMemo(() => {
    const _errors = { ...(submitClicked ? mandatoryErrors : {}), ...validationErrors }
    return _errors
  }, [validationErrors, submitClicked, mandatoryErrors])

  const valid = useMemo(() => isEmpty(errors) && isEmpty(mandatoryErrors), [errors, mandatoryErrors])

  const onLogin = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    if (!submitClicked) setSubmitClicked(true)
    if (valid) {
      userLogin(login)
    }
  }

  const loginSuccess = async (response: any) => {
    console.log('googleResponse', response)
    let data = {}
    if (response.profileObj) {
      data = {
        name: response.profileObj.name,
        email: response.profileObj.email,
        password: response.tokenId,
        provider: 'google',
        provider_id: response.profileObj.googleId,
        provider_pic: response.profileObj.imageUrl,
        accessToken: response.profileObj,
      }
    } else {
      data = {
        name: response.name,
        email: response.email,
        password: response.userID,
        provider: 'facebook',
        provider_id: response.id,
        provider_pic: response.picture.data.url,
      }
    }
    if (data) {
      signUp(data)
    }
  }

  return (
    <div>
      <GoogleLogin
        clientId={GOOGLE_CLIEND_ID}
        buttonText="Google"
        onSuccess={loginSuccess}
        onFailure={(response: any) => {
          // setLoginFailed(true);
        }}
        render={(renderProps) => (
          <img
            src={google}
            alt="google_button"
            className="login_button"
            role="presentation"
            onClick={renderProps.onClick}
          />
        )}
      />
      <FacebookLogin
        appId={FACEBOOK_APP_ID}
        fields="name,email,picture"
        callback={loginSuccess}
        onFailure={(response: any) => {
          // console.log(response)
        }}
        render={(renderProps: { onClick: React.MouseEventHandler<HTMLImageElement> }) => (
          <img
            src={facebook}
            alt="facebook_button"
            className="login_button"
            role="presentation"
            onClick={renderProps.onClick}
          />
        )}
      />
      <FormGroup className="row comment-box">
        <div className="col-lg-5 col-md-4">
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="emailAddress"
            value={login.email}
            invalid={!!errors.email}
            onChange={(e) => changeValue(e.target.value, 'email', 'email')}
          />
          {errors.email ? <FormFeedback>{errors.email}</FormFeedback> : null}
        </div>
        <div className="col-lg-5 col-md-4">
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="password"
            invalid={!!errors.password}
            onChange={(e) => changeValue(e.target.value, 'password', 'password')}
          />
          {errors.password ? <FormFeedback>{errors.password}</FormFeedback> : null}
        </div>
        <div className="col-lg-2 col-md-4">
          <Button color="primary" disabled={!valid} onClick={onLogin}>
            LogIn
          </Button>
        </div>
      </FormGroup>
    </div>
  )
}

export default UserLogin
