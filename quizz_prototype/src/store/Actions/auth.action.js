import { Http, HttpAuth } from "../../config/Http"
import { changeAlert } from "./alert.action"
import { changeConfirm } from "./confirm.action"
import { changeLoading } from "./loading.action"

export const actionTypes = {
    CHANGE: 'AUTH_CHANGE',
    SUCCESS : 'AUTH_SUCCESS',
    ERROR: 'AUTH_ERROR',
}

export const change = (payload) => ({
  type: actionTypes.CHANGE,
  payload
})

export const success = (payload) => ({
    type: actionTypes.SUCCESS,
    payload
})

export const error = (payload) => ({
    type: actionTypes.ERROR,
    payload
})

export const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_profile_data')
    localStorage.removeItem('social_access_token')
    window.location.replace('/')
}

export const register = data => dispatch => {
    
    dispatch(changeLoading({open: true}))
    HttpAuth.post('user/register', data).then(res => {
        dispatch(changeLoading({open: false}))
        if(typeof res !== 'undefined'){
            if(res.data.success){
                localStorage.setItem('access_token', res.data.access_token)
                dispatch(changeAlert({
                    open:true,
                    msg: res.data.success,
                    class: 'success'
                }))
            }

            if(res.status === 422) {
                dispatch(error(res.data.errors))
            }
        }
    })
}

export const login = credentials => dispatch => {

    let loginData = {}

    dispatch(changeLoading({open: true, msg: 'Carregando dados do usuário...'}))

    loginData = {
        grant_type: 'password',
        client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
        client_secret: process.env.REACT_APP_OAUTH_CLIENT_SECRET,
        username: credentials.email,
        password: credentials.password
    }

    return Http.post('oauth/token', loginData).then(res => {
        dispatch(changeLoading({open: false}))

        if (typeof res !== 'undefined') {
            if (res.data.access_token) {
                localStorage.setItem('access_token', res.data.access_token)
                dispatch(success(true))
            }
        }
    })
    .catch(error => {
        dispatch(changeLoading({ open: false }))
        if (typeof error.response !== 'undefined') {
            if (error.response.status === 401 || error.response.status === 400) {
                if(error.response.data.error === 'unverified_user'){
                    dispatch(changeConfirm({open: true,
                    confirmAction: () => {
                        dispatch(changeLoading({open: true, text: 'Enviando verificação'}))
                        HttpAuth.get('email/resend', {params: {email: credentials.email}}).then(res => {
                        dispatch(changeLoading({open: false}))
                        dispatch(changeConfirm({open: false}))
                        dispatch(changeAlert({ open: true, msg: res.data.success, class: 'success' }))
                    })
                },
                    msg: 'Caso confirme, um novo e-mail de verificação será enviado, cheque também sua caixa de spam.',
                    title: 'Seu e-mail de verificação expirou?'}))
                    dispatch(changeAlert({ open: true, msg: error.response.data.message, class: 'error' }))
                }else{
                    dispatch(changeAlert({ open: true, msg: 'Email ou senha incorretos ', class: 'error' }))
                }
            } else {
                dispatch(changeAlert({ open: true, msg: error.response.data.message, class: 'error' }))
            }
        }
    })
}

export const socialLogin = payload => dispatch => {
    let loginData = {}

    dispatch(changeLoading({open: true, msg: 'Carregando dados do usuário...'}))

    loginData = {
        grant_type: 'social',
        client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
        client_secret: process.env.REACT_APP_OAUTH_CLIENT_SECRET,
        provider: payload.provider,
        access_token: payload.access_token
    }

    return Http.post('oauth/token', loginData).then(res => {
        dispatch(changeLoading({open: false}))

        if (typeof res !== 'undefined') {
            if (res.data.access_token) {
                localStorage.setItem('access_token', res.data.access_token)
                localStorage.setItem('social_access_token', payload.access_token)
                dispatch(success(true))
            }
        }
    })
    .catch(error => {
        dispatch(changeLoading({ open: false }))
        if (typeof error.response !== 'undefined') {
            if (error.response.status === 401 || error.response.status === 400) {
                dispatch(changeAlert({ open: true, msg: 'Email ou senha incorretos ', class: 'error' }))
            } else {
                dispatch(changeAlert({ open: true, msg: error.response.data.message, class: 'error' }))
            }
        }
    })
}

export const forgotPassword = email => dispatch => {
    dispatch(changeLoading({open: true, text: 'Enviando email de recuperação'}))
    return HttpAuth.post('user/forgot-password', {email}).then(res => {
        dispatch(changeLoading({open: false}))
        if(res.status === 200){
            dispatch(changeAlert({open:true, msg: res.data.message, class: 'success'}))
        }else{
            dispatch(error(res.data.errors))
        }
        return res.status
    })
}

export const resetPassword = data => dispatch => {
    return HttpAuth.post('user/reset-password', data).then(res => {
        if(res.status === 200){
            dispatch(changeAlert({open:true, msg: res.data.success, class: 'success'}))
        }else{
            dispatch(changeAlert({open: true, msg:res.data.errors, class: 'error'}))
        }
        return res.status
    })
}


