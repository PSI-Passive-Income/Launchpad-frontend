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
                            <h5 className="title">Token details</h5>
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
                            <div className="form-group">
                                <Label className="control-label"> Token Decimals </Label>
                                <Input aria-describedby="addon-right addon-left" type="number"
                                       placeholder="Token Decimals" className="classNamem-control"/>
                            </div>
                            <div className="form-group">
                                <Label className="control-label"> Initial Supply </Label>
                                <Input aria-describedby="addon-right addon-left" type="number"
                                       placeholder="Initial Supply" className="classNamem-control"/>
                            </div>
                            <div className="form-group"><Label className="control-label"> Total Supply </Label>
                                <Input aria-describedby="addon-right addon-left" type="number"
                                       placeholder="Total Supply" className="classNamem-control"/>
                            </div>
                        </div>
                        <div className="col-md-4 pr-md-1">
                            <h5 className="title">Token features</h5>
                            <div className="form-group">
                                <Label className="control-label"> Supply Type </Label>
                                <Input aria-describedby="addon-right addon-left" placeholder="Supply Type"
                                       className="classNamem-control"/>
                            </div>
                            <div className="form-group">
                                <Label className="control-label"> Access Type </Label>
                                <Input aria-describedby="addon-right addon-left" placeholder="Access Type"
                                       className="classNamem-control"/>
                            </div>
                            <div className="mb-10 psi-switch custom-control custom-switch">
                                <Input type="checkbox" name="verifiedSourceCode" disabled="disabled"
                                       className="custom-control-input" value="true" id="__BVID__42"/>
                                <Label className="custom-control-label" htmlFor="__BVID__42"> Verified Source
                                    Code </Label>
                            </div>

                            <div className="mb-10 psi-switch custom-control custom-switch">
                                <Input type="checkbox" name="removeCopyright" className="custom-control-input"
                                       value="true" id="__BVID__43"/>
                                <Label className="custom-control-label" htmlFor="__BVID__43"> Remove Copyright </Label>
                            </div>
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
                            <div className="mb-10 psi-switch custom-control custom-switch">
                                <Input type="checkbox" name="operable" className="custom-control-input" value="true"
                                       id="__BVID__46"/>
                                <Label className="custom-control-label" htmlFor="__BVID__46"> Operable
                                    (ERC1363) </Label>
                            </div>
                            <div className="mb-10 psi-switch custom-control custom-switch">
                                <Input type="checkbox" name="tokenRecover" className="custom-control-input" value="true"
                                       id="__BVID__47"/>
                                <Label className="custom-control-label" htmlFor="__BVID__47"> Token Recover </Label>
                            </div>
                        </div>
                        <div className="col-md-4 pr-md-1">
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
                </div>
            </div>
        </>
    )

}

export default CreateTokenForm;