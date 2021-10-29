import React, { useState, useMemo } from 'react'
import { Input, UncontrolledCollapse, CardBody, Card, Button, FormGroup, FormFeedback } from "reactstrap"
import validate from 'utils/validate'
import { isEmpty } from 'lodash'
// import { useUserSignUp } from './asyncFunc'
import { signUpDataInfo } from 'state/types'
import { useUserEmail } from '../../state/hooks';



const UserSignUp: React.FC = () => {

    const { signUp } = useUserEmail()

    const [userSign, setUserSign] = useState<Partial<signUpDataInfo>>({});
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
    const [submitClicked, setSubmitClicked] = useState(false)

    const changeValue = (value: string | boolean, name: string, type: string, mandatory = true) => {
        const { newValue, newErrors } = validate(userSign, validationErrors, value, name, type, mandatory)
        setValidationErrors(newErrors)
        setUserSign(newValue)
    }

    const mandatoryErrors = useMemo(() => {
        const _errors: { [key: string]: string } = {}
        if (isEmpty(userSign.name)) _errors.name = 'This field is required'
        if (isEmpty(userSign.email)) _errors.email = 'This field is required'
        if (isEmpty(userSign.password)) _errors.password = 'This field is required'

        return _errors
    }, [userSign])

    const errors: { [key: string]: string } = useMemo(() => {
        const _errors = { ...(submitClicked ? mandatoryErrors : {}), ...validationErrors }
        return _errors
    }, [validationErrors, submitClicked, mandatoryErrors])

    const valid = useMemo(() => isEmpty(errors) && isEmpty(mandatoryErrors), [errors, mandatoryErrors])

    const onSignUp = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        if (!submitClicked) setSubmitClicked(true)
        if (valid) {
            signUp(userSign)
        }
    }

    return (
        <div>
            <div className='text-center'>
                <Button color="primary" id="toggler" style={{ marginBottom: '1rem', alignItems: 'center' }}>
                    SignUp
                </Button>
            </div>
            <UncontrolledCollapse toggler="#toggler">
                        <FormGroup >
                            <div className="row comment-box">
                                <div className="col-lg-6 col-md-6">
                                    <Input
                                        type="text"
                                        name="name"
                                        id="exampleName"
                                        placeholder="Name"
                                        value={userSign.name}
                                        invalid={!!errors.name}
                                        onChange={(e) => changeValue(e.target.value, 'name', 'text')}
                                    />
                                    {errors.name ? <FormFeedback>{errors.name}</FormFeedback> : null}
                                </div>
                                <div className="col-lg-6 col-md-6">
                                    <Input
                                        type="email"
                                        name="email"
                                        id="exampleEmail"
                                        placeholder="Email"
                                        value={userSign.email}
                                        invalid={!!errors.email}
                                        onChange={(e) => changeValue(e.target.value, 'email', 'email')}
                                    />
                                    {errors.email ? <FormFeedback>{errors.email}</FormFeedback> : null}
                                </div>
                            </div>
                            <br />
                            <div className="row comment-box">
                                <div className="col-lg-6 col-md-6">
                                    <Input
                                        type="password"
                                        name="password"
                                        id="examplePassword"
                                        placeholder="Password"
                                        value={userSign.password}
                                        invalid={!!errors.password}
                                        onChange={(e) => changeValue(e.target.value, 'password', 'password')}
                                    />
                                    {errors.password ? <FormFeedback>{errors.password}</FormFeedback> : null}
                                </div>
                                <div className="col-lg-3 col-md-3">
                                    <Button color="primary" disabled={!valid} onClick={onSignUp}>SignUp</Button>
                                </div>
                            </div>
                        </FormGroup>
            </UncontrolledCollapse>

        </div>
    )

}

export default UserSignUp;