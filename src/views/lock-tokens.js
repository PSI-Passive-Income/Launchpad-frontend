import React from "react";
import CreateTokenForm from "./create-token-form";
import LockTokenCard from "../components/lockTokenCard";

function LockToken() {
    return (
        <>
            <div className="content">

                <div className="row">
                    <div className="col-md-12">
                    <LockTokenCard/>
                    </div>
                </div>
            </div>
        </>
    );
}
export default LockToken;
