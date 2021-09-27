import { useCallback, useEffect, useState } from 'react';
import { useLoggedInUser } from 'state/hooks'
import { toastError } from 'state/actions'
import { useDispatch } from 'react-redux'
import { useActiveWeb3React } from 'hooks/web3'
import { setkycUserVerification, getKYCuserVerifcation } from '../utils/apiHelper';


const useUserVerification = () => {
    const dispatch = useDispatch()

    const { account } = useActiveWeb3React()
    const { accessToken } = useLoggedInUser()

    const [verified, setVerified] = useState({});

    const onStart = useCallback(() => {
        if (!account) {
            dispatch(toastError('Error Verification', 'Please check wallet connection'))
        }
    }, [dispatch, account])

    const onSumit = useCallback(async (key) => {
        const abc = await setkycUserVerification(account, key);
        console.log('referenceUserWithKey', abc)
    }, [account])

    const onError = useCallback(async (errorCode) => {
        dispatch(toastError('Error Verification', errorCode))
    }, [dispatch])

    const getUserVerified = useCallback(async (address:string) => {
        const user = await getKYCuserVerifcation(address);
        setVerified(user);
    }, [])

    return { submit: onSumit, start: onStart, error: onError, KYCaddress: getUserVerified, account, accessToken, verified }
}

export default useUserVerification;


