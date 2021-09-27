import React from 'react';
import VerifyButton from "@passbase/button/react";
import { PASSBASE_API_KEY } from 'config/constants/misc';
import useUserVerification from 'hooks/useUserKYC';

const Verification: React.FC = () => {

    const { submit, start, error, KYCaddress, account, accessToken, verified } = useUserVerification();
    KYCaddress(account);

    return (
        <div className="content">
            <div className="row">
                <div className="col-md-12">
                    <div className="KYC-box">
                        {account && accessToken ? (
                            <>
                                {verified ? (
                                    <p className="KYC-text">User Verified</p>
                                ) :
                                    <div className="Card KYC-box">
                                        <ul>
                                            <li>Make sure you are connected with a whitelisted wallet</li>
                                            <li>Enter the region or country they are based out of</li>
                                            <li>Enter a link where users/law officials can report this wallet or request information</li>
                                            <li>Enter a link where users/law officials can report this wallet or request information</li>
                                        </ul>
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
                        ) : <p className="KYC-text">Please connect wallet</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Verification;
