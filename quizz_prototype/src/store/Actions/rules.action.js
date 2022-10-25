import { HttpAuth } from "config/Http"
import { changeAlert } from "./alert.action"
import { changeLoading } from "./loading.action"
import { index } from "./quizz.action"

export const actionTypes = {
    CHANGE: 'CHANGE_RULES',
    SHOW: 'SHOW_RULES',
    UPDATE: 'UPDATE_RULES'
}

export const change = (payload) => ({
  type: actionTypes.CHANGE,
  payload
})

export const showResponse = (payload) => ({
  type: actionTypes.SHOW,
  payload
})

export const show = token => dispatch => {
  return HttpAuth.get('quizz/' + token).then(res => {
    dispatch(showResponse(res.data.quizz))
  })
}

export const update = (id, payload) => dispatch => {
  dispatch(changeLoading({open: true}))
  return HttpAuth.post('quizz/'+id+'?_method=PUT', payload).then(res => {
    
    dispatch(changeLoading({open: false}))
    dispatch(index()).then(() => {
      if(res.data.success){
        dispatch(changeAlert({open: true, msg: res.data.success, class: 'success'}))
        dispatch(change({open: false}))
      }

      if(res.data.error){
        dispatch(changeAlert({open: true, msg: res.data.error, class: 'error'}))
        dispatch(change({open: true}))
      }
    })
  })
}

