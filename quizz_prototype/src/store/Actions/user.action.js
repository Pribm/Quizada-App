import { HttpAuth } from "config/Http"
import { getUserThumbnail } from "utils/getThumbnails"
import { changeAlert } from "./alert.action"


export const actionTypes = {
    CHANGE: 'USER_CHANGE',
    INDEX: 'USER_INDEX',
    ERRORS: 'USER_ERRORS'
}

export const change = (payload) => ({
  type: actionTypes.CHANGE,
  payload
})

export const errors = payload => ({
  type: actionTypes.ERRORS,
  payload
})

const indexResponse = (payload, loadMoreUsers) => ({
  type: actionTypes.INDEX,
  payload: payload,
  loadMoreUsers
})

export const index = (payload) => dispatch => {

  return HttpAuth.get('/user', { params: { ...payload } }).then(res => {

    if (typeof res !== 'undefined') {
        dispatch(indexResponse({
          ...res.data,
          user: {
            ...res.data.user,
            avatar:
              res.data.user.custom_avatar === 1 ?
                getUserThumbnail(res.data.user.avatar, res.data.user.id)
                :
                res.data.user.avatar
          }
        },true))
    }
  })
}

export const update = payload => dispatch => {
  HttpAuth.post('user?_method=PUT', payload).then(res => {
    if(typeof res !== 'undefined'){

      if(res.data.errors){
        dispatch(errors(res.data.errors))
        return
      }

      dispatch(indexResponse({
        user: {
          ...res.data.user,
          avatar:
          res.data.user.custom_avatar === 1 ?
          getUserThumbnail(res.data.user.avatar, res.data.user.id)
          :
          res.data.user.avatar
        }
      }))

      dispatch(changeAlert({open: true, class: 'success', msg: res.data.success}))
      
    }
  })
}

