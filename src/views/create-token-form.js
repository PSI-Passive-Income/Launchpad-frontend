import React from "react";

// reactstrap components
import {Card, CardHeader, CardBody, Row, Col, Label, Input} from "reactstrap";

function CreateTokenForm() {
    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h5 className="title">Create Token</h5></div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4 pr-md-1">
                            <div className="form-group">
                                <Label className="control-label"> Token Name
                                </Label>
                                <Input aria-describedby="addon-right addon-left" placeholder="Token Name"
                                       className="classNamem-control">
                                </Input>
                            </div>
                            <div className="form-group">
                                <Label className="control-label"> Token Symbol </Label>
                                <Input aria-describedby="addon-right addon-left" placeholder="Token Symbol"
                                       className="classNamem-control"/>
                            </div>
                            <h5 className="title mt-2">Token features</h5>
                            <div className="mb-10 psi-switch custom-control custom-switch">
                                <Input type="checkbox" name="burnable" className="custom-control-input" value="true"
                                       id="__BVID__44"/>
                                <Label className="custom-control-label" htmlFor="__BVID__44"> Burnable </Label>
                            </div>
                            <div className="mb-10 psi-switch custom-control custom-switch">
                                <Input type="checkbox" name="mintable" className="custom-control-input" value="true"
                                       id="__BVID__45"/>
                                <Label className="custom-control-label" htmlFor="__BVID__45"> Mintable </Label>
                            </div>
                        </div>
                        <div className="col-md-4 pr-md-1">
                            <div className="form-group">
                                <Label className="control-label"> Initial Supply </Label>
                                <Input aria-describedby="addon-right addon-left" type="number"
                                       placeholder="Initial Supply" className="classNamem-control"/>
                            </div>
                            <div className="form-group"><Label className="control-label"> Maximum Supply </Label>
                                <Input aria-describedby="addon-right addon-left" type="number"
                                       placeholder="Maximum Supply" className="classNamem-control"/>
                            </div>

                        </div>
                        <div className="col-md-4 pr-md-3">
                            <h5 className="title">Network and Transaction</h5>
                            <select className="mb-6 mb-10 custom-select" id="__BVID__48">
                                <option value="bsc">Binance Smart Chain</option>
                            </select>
                            <div className="mb-10 psi-switch custom-control custom-switch">
                                <Input type="checkbox" name="tos" className="custom-control-input" value="true"
                                       id="__BVID__49"/>
                                <Label className="custom-control-label" htmlFor="__BVID__49"> I have read, understood
                                    and agreed to PSI Terms of Use. Use at your own risk. </Label>
                            </div>
                            <p> Commission Fee: Free (Promotion active) </p>
                            <p> Gas Fee: Variable </p>
                            <button type="button" className="btn btn-primary" slot="footer" fill="">Create</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <h5 className="red mt-5">Important Notes:</h5>
                            <ul className="pl-4">
                                <li className="important-notes-list">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
                                <li className="important-notes-list">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
                                <li className="important-notes-list">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
                                <li className="important-notes-list">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
                                <li className="important-notes-list">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
                                <li className="important-notes-list">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default CreateTokenForm;