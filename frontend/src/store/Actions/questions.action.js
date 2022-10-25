import { HttpAuth } from "config/Http"
import { changeAlert } from "./alert.action"
import { changeLoading } from "./loading.action"

export const actionTypes = {
    CHANGE: 'QUESTIONS_CHANGE',
    ERRORS: 'QUESTIONS_ERRORS',
    INDEX: 'QUESTIONS_INDEX',
    SHOW: 'QUESTIONS_SHOW',
    DESTROY: 'QUESTIONS_DESTROY',
    SUCCESS: 'QUESTIONS_SUCCESS',
}

export const change = (payload) => ({
  type: actionTypes.CHANGE,
  payload
})

export const errors = (payload) => ({
  type: actionTypes.ERRORS,
  payload
})

export const success = payload => ({
    type: actionTypes.SUCCESS,
    payload
})

const indexResponse = (payload, isLoadMore = false) => ({
    type: actionTypes.INDEX,
    payload,
    isLoadMore
})

export const showResponse = (payload) => ({
  type: actionTypes.SHOW,
  payload
})


export const show = (id) => dispatch => {
    return HttpAuth.get('/question/pick/'+id).then(res => {
        if(typeof res !== 'undefined'){
            dispatch(showResponse(res.data))
        }
    })
}
export const index = (payload, isLoadMore) => dispatch => {
 
    return HttpAuth.get('question/list', {params: payload}).then(res => {
        if(typeof res !== 'undefined'){
            dispatch(indexResponse(res.data, isLoadMore))
        }
    })
}

export const update = (id, payload) => dispatch => {
    dispatch(changeLoading({open: true}))
    return HttpAuth.post('question/'+id+'?_method=PUT', payload).then(res => {
        dispatch(changeLoading({open: false}))
        if(res.data.success){
            dispatch(changeAlert({open: true, class: 'success', msg: res.data.success}))
            dispatch(index())
            return true
        }
        if(res.data.errors){
            dispatch(errors(res.data.errors))
        }
        if(res.data.error){
            dispatch(changeAlert({open: true, class: 'error', msg: res.data.error}))
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

export const destroy = payload => dispatch => {

    dispatch(changeLoading({open:true}))
    let question = {}

    payload.forEach((q, i) => question[i] = q)

    HttpAuth.post('/question', {_method: 'delete', question}).then(res => {
        dispatch(changeLoading({open:false}))
        if(res.data.success){
            dispatch(index())
        }
    })
}

const getFileFromBlob = async (blob) => {
    let data = await fetch(blob)
    const blobFile = await data.blob();
    return blobFile
}
