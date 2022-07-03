import { Http } from "../../config/Http"
import { changeAlert } from "./alert.action"
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
    window.location.replace('/')
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
                dispatch(changeAlert({ open: true, msg: 'Email ou senha incorretos ', class: 'error' }))
            } else {
                dispatch(changeAlert({ open: true, msg: error.response.data.message, class: 'error' }))
            }
        }
    })
}


