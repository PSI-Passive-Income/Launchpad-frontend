import React from 'react';
import VerifyButton from "@passbase/button/react";
import { PASSBASE_API_KEY } from 'config/constants/misc';
import useUserVerification from 'hooks/useUserKYC';

const Verification: React.FC = () => {

    const { submit, start, error, account, accessToken, verified } = useUserVerification();

    return (
        <div className="content KYC-box">
            <div className="row">
                <div className="col-md-12">
                    <div>
                        {account && accessToken ? (
                            <>
                                {verified ? (
                                    <h3 className="text-center">User Verified</h3>
                                ) :
                                    <div>
                                        <VerifyButton
                                            apiKey={PASSBASE_API_KEY}
                                            onSubmitted={submit}
                                            onError={error}
                                            onStart={start}
                                            prefillAttributes={{
                                                email: "bergmediagroup@gmail.com"
                                            }}
                                            theme={{
                                                darkMode: false,
                                            }}
                                        />
                                    </div>}
                            </>
                        ) : <h3 className=" text-center">Please connect wallet</h3>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Verification;
