import { HttpAuth } from "config/Http"
import { changeAlert } from "./alert.action"
import { changeLoading } from "./loading.action"

export const actionTypes = {
    INDEX: 'APP_INDEX',
    CHANGE: 'APP_CHANGE',
    ERRORS: 'APP_ERRORS'
}

export const change = (payload) => ({
  type: actionTypes.CHANGE,
  payload
})

export const errors = (payload) => ({
  type: actionTypes.ERRORS,
  payload
})


const indexResponse = (payload) => ({
  type: actionTypes.INDEX,
  payload
})

export const index = () => dispatch => {
    return HttpAuth.get('get-app-info').then(res => {
        if(res.data.success){
            document.cookie = `app_info=${JSON.stringify(res.data.success)}`
            dispatch(indexResponse(res.data.success))
        }

        if(res.data.error){
            dispatch(changeAlert({open: true, msg: res.data.error, class: 'error'}))
        }
    })
}

export const update = payload => dispatch => {
    dispatch(changeLoading({open: true}))
    return HttpAuth.post('update-app-info', payload).then(res => {
        dispatch(changeLoading({open: false}))

        if(res.data.success){
            dispatch(changeAlert({open: true, msg: res.data.success, class: 'success'}))
            dispatch(indexResponse(res.data.data))
            return true
        }

        if(res.data.error){
            dispatch(changeAlert({open: true, msg: res.data.error, class: 'success'}))
            return false
        }

        if(res.data.errors){
            dispatch(errors(res.data.errors))
            return false
        }
    })
}
