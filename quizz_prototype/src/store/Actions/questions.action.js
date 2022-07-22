import { HttpAuth } from "config/Http"
import { changeLoading } from "./loading.action"

export const actionTypes = {
    CHANGE: 'QUESTIONS_CHANGE',
    INDEX: 'QUESTIONS_INDEX',
    SUCCESS: 'QUESTIONS_SUCCESS',
}

export const change = (payload) => ({
  type: actionTypes.CHANGE,
  payload
})

export const success = payload => ({
    type: actionTypes.SUCCESS,
    payload
})

const indexResponse = payload => ({
    type: actionTypes.INDEX,
    payload
})

export const index = payload => dispatch => {
    dispatch(changeLoading({open:true}))
    return HttpAuth.get('question/list', {params: payload}).then(res => {
        dispatch(changeLoading({open:false}))
        if(typeof res !== 'undefined'){
            dispatch(indexResponse(res.data))
        }
    })
}

export const store = payload => dispatch => {
    dispatch(changeLoading({open:true}))
    return HttpAuth.post('question/upload', payload).then(res => {
        dispatch(changeLoading({open:false}))
        if(res.data.success){
            dispatch(success(true))
        }
    })
}
