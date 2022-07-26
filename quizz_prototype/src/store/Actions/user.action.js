import { HttpAuth } from "config/Http"
import { getUserThumbnail } from "utils/getThumbnails"
import { changeAlert } from "./alert.action"
import { changeLoading } from "./loading.action"


export const actionTypes = {
    CHANGE: 'USER_CHANGE',
    INDEX: 'USER_INDEX',
    RANKING: 'USER_RANKING',
    GET_QUIZZ_INVITATIONS: 'GET_QUIZZ_INVITATIONS',
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

const indexResponse = (payload, isLoadMore) => ({
  type: actionTypes.INDEX,
  payload: payload,
  isLoadMore
})

const rankingResponse = (payload, isLoadMore) => ({
  type: actionTypes.RANKING,
  payload: payload,
  isLoadMore
})

const getQuizzInvitationsResponse = (payload, loadMore) => ({
  type: actionTypes.GET_QUIZZ_INVITATIONS,
  payload: payload,
  loadMore
})

export const index = (payload) => dispatch => {
  return HttpAuth.get('/user', { params: { ...payload } }).then(res => {
    if (typeof res !== 'undefined') {
        dispatch(indexResponse({
          user: {
            ...res.data,
            avatar:
              res.data.custom_avatar === 1 ?
                getUserThumbnail(res.data.avatar, res.data.id)
                :
                res.data.avatar
          }
        },true))
    }
  })
}

export const ranking = () => dispatch => {
  dispatch(changeLoading({open: true}))
  HttpAuth.get('/user/ranking').then(res => {
    dispatch(changeLoading({open: false}))
    if(typeof res !== 'undefined'){
      dispatch(rankingResponse(res.data, false))
    }
  })
}

export const getQuizzInvitations = (payload, isLoadMore) => dispatch => {
  HttpAuth.get('quizz?showAcceptedQuizzList=true', {params: payload}).then(res => {
    dispatch(getQuizzInvitationsResponse(res.data, isLoadMore))
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

