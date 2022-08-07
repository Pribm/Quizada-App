import {  HttpAuth } from "config/Http"
import { changeAlert } from "./alert.action"
import { changeConfirm } from "./confirm.action"
import { changeLoading } from "./loading.action"

export const actionTypes = {
    CHANGE : 'CHANGE_QUIZZ',
    ERROR: 'QUIZZ_ERROR',
    SUCCESS: 'QUIZZ_SUCCESS',
    INDEX: 'QUIZZ_INDEX',
    CREATE: 'QUIZZ_CREATE',
    DESTROY: 'QUIZZ_DESTROY',
}

export const change = (payload) => {
    return ({
        type: actionTypes.CHANGE,
        payload
    })
}

export const error = (payload) => ({
  type: actionTypes.ERROR,
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



export const index = (payload, isLoadMore) => dispatch => {

    if(typeof payload?.search !== 'undefined'){
        dispatch(changeLoading({open: true}))
    }

    return HttpAuth.get('quizz',  {params: {...payload}}).then(res => {
        dispatch(changeLoading({open: false}))
        dispatch(indexResponse(res.data, isLoadMore))
    })
}

export const restartInvitations = (token) => dispatch => {
    HttpAuth.get('quizz/reset-invitations/'+token).then(res => {
        if(res.data.success){
            dispatch(changeAlert({open: true, msg: res.data.success, class: 'success'}))
            dispatch(index())
        }
        if(res.data.error){
            dispatch(changeAlert({open: true, msg: res.data.error, class: 'error'}))
        }
    })
}

export const deleteInvitations = (token) => dispatch => {
    HttpAuth.get('quizz/delete-invitations/'+token).then(res => {
        if(res.data.success){
            dispatch(changeAlert({open: true, msg: res.data.success, class: 'success'}))
            dispatch(index())
        }
        if(res.data.error){
            dispatch(changeAlert({open: true, msg: res.data.error, class: 'error'}))
        }
    })
}

export const create = payload => dispatch => {
    dispatch(changeLoading({open: true}))

    HttpAuth.post('quizz', payload).then(res => {
        dispatch(changeLoading({open: false}))
        if(res.data.success){
            dispatch(change({token: res.data.quizz.token}))
            dispatch(success(true))
        }

        if(res.data.error){
            dispatch(changeAlert({open: true, msg: res.data.error, class: 'error'}))
        }
    })
}

export const makeInvitation = (token, id) => dispatch => {
    dispatch(changeLoading({open: true}))
    return HttpAuth.get(`quizz/make-invitation/${token}/${id}`).then(res => {
        dispatch(changeLoading({open: false}))
        if(res.data.success){
            dispatch(changeAlert({open: true, msg: res.data.success, class: 'success', autoHideDuration: 4000}))
            return true
        }

        if(res.data.error){
            dispatch(changeAlert({open: true, msg: res.data.error, class: 'error', autoHideDuration: 4000}))
            return false
        }
    })
}

export const massInvitation = payload => dispatch => {

    dispatch(changeLoading({open: true}))
    return HttpAuth.post(`quizz/mass-invitation`, payload).then(res => {

        dispatch(changeLoading({open: false}))
        if(res.data.success){
            dispatch(changeAlert({open: true, msg: res.data.success, class: 'success', autoHideDuration: 4000}))
        }

        if(res.data.error){
            dispatch(changeAlert({open: true, msg: res.data.error, class: 'error', autoHideDuration: 4000}))
        }
    })
}

export const destroy = id => dispatch => {
    dispatch(changeLoading({open: true}))
    HttpAuth.delete(`quizz/${id}`).then(res => {
        dispatch(changeLoading({open: false}))
        if(res.data.success){
            dispatch(index())
            dispatch(changeConfirm({open: false}))
        }
    })
}
 
export const uploadQuizzFile =  (payload) => dispatch => {
    let formdata = new FormData()

    Object.entries(payload).forEach(async (element, i, array) => {
        let file = element[1];
        

        if(typeof element[1] === 'string' && /(blob*)/.test(element[1])){
            let data = await getFileFromBlob(element[1])

            file = new Blob([data], {type: data.type})
        }

        formdata.append(element[0], file)
        
        if(i === (array.length - 1)){
           HttpAuth.post('question/upload', formdata).then(res => {
                
                if(res.data.errors){
                    dispatch(error(res.data.errors))
                }

                if(res.data.success){
                    dispatch(change({token: res.data.token}))
                    dispatch(success(true))
                }
           })
        }
    })

    
   

    
}

const getFileFromBlob = async (blob) => {
    let data = await fetch(blob)
    const blobFile = await data.blob();
    return blobFile
}

