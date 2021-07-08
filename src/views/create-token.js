import React from "react";

// reactstrap components
import { Card, CardHeader, CardBody, Row, Col, Label,Input } from "reactstrap";
import CreateTokenForm from "./create-token-form";

function CreateToken() {
    return (
        <>
                        <div className="content">

            <div className="row">
    <div className="col-md-12">
      <CreateTokenForm>
      </CreateTokenForm>
    </div>
                </div>
                </div>
        </>
    )
    
}

export default CreateToken;