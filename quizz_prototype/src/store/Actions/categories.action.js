import { HttpAuth } from "config/Http"
import { changeLoading } from "./loading.action"

export const actionsTypes = {
    CHANGE : 'CHANGE_CATEGORIES',
    INDEX: 'CATEGORIES_INDEX',
    DESTROY: 'CATEGORIES_DESTROY',
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

export const destroyResponse = payload => ({
  type: actionsTypes.DESTROY,
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
    return HttpAuth.get('question/categories', {params: payload})
    .then(res => dispatch(indexResponse(res.data)))
}

export const create = payload => dispatch => {
    dispatch(changeLoading({open: true}))
    return HttpAuth.post('question/categories', payload).then(res => {
        dispatch(changeLoading({open: false}))
        if(res.data.success){
          dispatch(index()).then(() => dispatch(change(res.data.success)))
          return {success: true, category: res.data.success.id}
        }

        if(res.data.errors){
          dispatch(error(res.data.errors))
          return false
        }
    })
}

export const destroy = id => dispatch => {
  dispatch(changeLoading({open: true}))
  HttpAuth.delete('question/categories/'+id).then(res => {
    dispatch(changeLoading({open: false}))
    dispatch(destroyResponse(res.data.deleted_id))
  })
}

