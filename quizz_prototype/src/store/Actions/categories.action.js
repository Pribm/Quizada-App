import { HttpAuth } from "config/Http"
import { changeLoading } from "./loading.action"

export const actionsTypes = {
    CHANGE : 'CHANGE_CATEGORIES',
    INDEX: 'CATEGORIES_INDEX',
    SUCCESS: 'CATEGORIES_SUCCESS',
    ERROR: 'CATEGORIES_ERROR'
}

export const change = (payload) => ({
  type: actionsTypes.CHANGE,
  payload
})

export const indexResponse = (payload) => ({
  type: actionsTypes.INDEX,
  payload
})

export const success = (payload) => ({
  type: actionsTypes.SUCCESS,
  payload
})

export const error = (payload) => ({
  type: actionsTypes.ERROR,
  payload
})



export const index = payload => dispatch => {
    return HttpAuth.get('question/categories', {params: new URLSearchParams({name: payload})}).then(res => dispatch(indexResponse(res.data.categories)))
}

export const create = payload => dispatch => {
    dispatch(changeLoading({open: true}))
    return HttpAuth.post('question/categories', payload).then(res => {
        dispatch(changeLoading({open: false}))
        if(typeof res !== 'undefined'){
            if(res.data.success){
                dispatch(success(res.data.success))
            }
            if(res.data.errors){
                dispatch(error(res.data.errors))
            }
        }
    })
}

