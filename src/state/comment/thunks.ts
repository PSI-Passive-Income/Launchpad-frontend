import { toastError } from 'state/toasts'
import { loginDataInfo, signUpDataInfo } from 'state/types'
import { apiIsExist, apiSignUp, apiLogIn, fetchComments, updateComment, deleteCommentApi } from '../../utils/apiHelper'
import { AppDispatch, RootState } from '../store'
import { userLogIn, userLogInfailed, userLogOut, userSignUpSucceed, loadComments, loadupdateComment, deleteComment } from '.'


export const userSignUpEmail =
    (signUp: signUpDataInfo) => async (dispatch: AppDispatch, getState: () => RootState) => {

        const signUpError = await apiIsExist(signUp);
        if (signUpError) {
            if (signUpError.provider) {
                sessionStorage.setItem("user", JSON.stringify(signUpError));
                dispatch(userLogIn(signUpError))
            } else {
                dispatch(toastError('Error SignUp', "User Already Exist"))
            }
        } else {
            const response = await apiSignUp(signUp);
            sessionStorage.setItem("user", JSON.stringify(response));
            dispatch(userLogIn(response))
        }
    }

export const logInEmail =
    (login?: Partial<loginDataInfo>) => async (dispatch: AppDispatch, getState: () => RootState) => {

        const userInfo = sessionStorage.getItem('user')
        const { userName } = userInfo ? JSON.parse(userInfo) : { userName: null }
        if (userName) dispatch(userLogIn(JSON.parse(userInfo)))
        if (userName) return

        if (login) {
            try {
                const LogIn = await apiLogIn(login);
                sessionStorage.setItem("user", JSON.stringify(LogIn));
                dispatch(userLogIn(LogIn))
            } catch (err) {
                dispatch(toastError('Login Failed', 'incorrect email or password'));
            }
        }
    }

export const logOutEmail = () => {
    sessionStorage.removeItem('user')
    return userLogOut()
}

export const getComments =
    (campaignId: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            const comment = await fetchComments(campaignId);
            dispatch(loadComments(comment))
        } catch (err:any) {
            dispatch(toastError('error', err?.message));
        }
    }

export const getUpdateComment = (data: { id: number; comment: string }, campaignId: string) => async (dispatch: AppDispatch, getState: () => RootState) => {

    try {
        await updateComment(data, campaignId);
        dispatch(loadupdateComment(data))
    } catch (err:any) {
        dispatch(toastError('error', err?.message));
    }
}

export const removeComment =
    (campaignId: string, id: number) => async (dispatch: AppDispatch, getState: () => RootState) => {

        try {
            const abc = await deleteCommentApi(campaignId, id);
            dispatch(deleteComment(id))
        } catch (err:any) {
            dispatch(toastError('error', err?.message));
        }
    }


