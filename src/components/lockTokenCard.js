import React from "react";
import {Container, FormGroup, Input, Label} from "reactstrap";



function LockTokenCard() {
    const [activeTab, setActiveTab] = React.useState('1');

    const toggle = tab => {
        if(activeTab !== tab) setActiveTab(tab);
    }
    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h5 className="title">Lock or Manage Tokens</h5></div>
                <div className="card-body">
                    <p className="text-center">Use the PsiLock Token Locker to lock your tokens and earn greater trust within your community!
                    </p>

                    <div className="col-lg-7 offset-lg-2">
                    <div className="card mt-5">
                        <div className="card-body">
                            <FormGroup>
                                <p for="addressInput" className="text-center">PsiLock Token Locker</p>
                                <Input type="text" name="addressInput" id="exampleEmail" placeholder="Enter Token Address" />
                            </FormGroup>
                        </div>
                    </div>
                    </div>

                </div>
            </div>
        </>
    )

}

export default LockTokenCard;