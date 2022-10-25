import { HttpAuth } from "config/Http"
import { changeAlert } from "./alert.action"



export const actionTypes = {
    CHANGE: 'USER_CHANGE',
    INDEX: 'USER_INDEX',
    RANKING: 'USER_RANKING',
    GET_USERS_FOR_ADM: 'GET_USERS_FOR_ADM',
    GET_QUIZZ_INVITATIONS: 'GET_QUIZZ_INVITATIONS',
    QUIZZ_FROM: 'QUIZZ_FROM',
    QUIZZ_TO: 'QUIZZ_TO',
    GET_QUIZZ_COMPLETE: 'GET_QUIZZ_COMPLETE',
    GET_PUBLIC_QUIZZ: 'GET_PUBLIC_QUIZZ',
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
const indexResponse = (payload, isLoadMore=false) => ({
  type: actionTypes.INDEX,
  payload: payload,
  isLoadMore
})
const getUsersForAdmResponse = (payload, isLoadMore=false) => ({
  type: actionTypes.GET_USERS_FOR_ADM,
  payload: payload,
  isLoadMore
})
const getQuizzInvitationsResponse = (payload, isLoadMore=false) => ({
  type: actionTypes.GET_QUIZZ_INVITATIONS,
  payload: payload,
  isLoadMore
})
const quizzFromResponse = (payload, isLoadMore=false) => ({
  type: actionTypes.QUIZZ_FROM,
  payload: payload,
  isLoadMore
})
const quizzToResponse = (payload, isLoadMore=false) => ({
  type: actionTypes.QUIZZ_TO,
  payload: payload,
  isLoadMore
})
const quizzCompleteResponse = (payload, isLoadMore=false) => ({
  type: actionTypes.GET_QUIZZ_COMPLETE,
  payload: payload,
  isLoadMore
})
const getPublicQuizzResponse = (payload, isLoadMore=false) => ({
  type: actionTypes.GET_PUBLIC_QUIZZ,
  payload: payload,
  isLoadMore
})
export const index = (payload) => dispatch => {
  return HttpAuth.get('/user', { params: { ...payload } }).then(res => {
    if (typeof res !== 'undefined') {
        dispatch(indexResponse(res.data))
    }
  })
}
export const getUsersForAdm = (payload, isLoadMore) => dispatch => {

  return HttpAuth.get('user/show-to-adm', {params: payload}).then(res => {
    dispatch(getUsersForAdmResponse(res.data, isLoadMore))
  })
}
export const sendAdmInvitation = id => dispatch => {
  HttpAuth.get('/user/send-adm-invitation/'+id).then(() => dispatch(getUsersForAdm()))
}
export const removeAdmInvitation = id => dispatch => {
  HttpAuth.get('/user/send-adm-invitation/'+id, {params: {remove: true}}).then(() => dispatch(getUsersForAdm()))
}
export const acceptAdmInvitation = ( accept = false) => dispatch => {
  HttpAuth.get('/user').then(res => {
    let invitationId = res.data.user.adm_invitation_from[0].pivot.id
    HttpAuth.get('/user/accept-adm-invitation/'+invitationId+'/'+accept).then(() => dispatch(getUsersForAdm()))
  })
}
export const getNotifications = (payload) => dispatch => {
  return HttpAuth.get('/user/getNotifications', { params: { ...payload } }).then(res => {
    if (typeof res !== 'undefined') {
    
        dispatch(indexResponse(res.data))
    }
  })
}
export const openNotifications = notificationIds => dispatch => {

  HttpAuth.post('/user/open-notification',{notifications_ids: JSON.stringify(notificationIds)})
  .then(() => {
    dispatch(index())
  })
}
export const getQuizzInvitations = (payload, isLoadMore) => dispatch => {
  return HttpAuth.get('quizz', {params: payload}).then(res => {
    dispatch(getQuizzInvitationsResponse(res.data, isLoadMore))
  })
} 
export const quizzFrom = (payload, isLoadMore) => dispatch => {
  return HttpAuth.get('quizz', {params: {...payload, quizzFrom: true}}).then(res => {
    dispatch(quizzFromResponse(res.data, isLoadMore))
  })
} 
export const quizzTo = (payload, isLoadMore) => dispatch => {
  return HttpAuth.get('quizz', {params: {...payload, quizzTo: true}}).then(res => {
    dispatch(quizzToResponse(res.data, isLoadMore))
  })
} 

export const getQuizzComplete = (payload, isLoadMore) => dispatch => {
  return HttpAuth.get('quizz', {params: payload}).then(res => {
    dispatch(quizzCompleteResponse(res.data, isLoadMore))
  })
} 

export const getPublicQuizz = (payload, isLoadMore) => dispatch => {
  return HttpAuth.get('quizz', {params: payload}).then(res => {
    dispatch(getPublicQuizzResponse(res.data, isLoadMore))
  })
}

export const acceptQuizzInvitation = id => dispatch => {
  HttpAuth.put('quizz/accept/'+id).then(() => {
    dispatch(quizzFrom())
  })
}

export const refuseQuizzInvitation = id => dispatch => {
  HttpAuth.get('quizz/refuse/'+id).then(() => {
    dispatch(quizzFrom())
  })
}

export const deleteQuizzInvitations = (token) => dispatch => {
  HttpAuth.get('quizz/delete-invitations/'+token).then(res => {
      if(res.data.success){
          dispatch(changeAlert({open: true, msg: res.data.success, class: 'success'}))
          dispatch(quizzTo())
      }
      if(res.data.error){
          dispatch(changeAlert({open: true, msg: res.data.error, class: 'error'}))
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

      dispatch(indexResponse(res.data))

      dispatch(changeAlert({open: true, class: 'success', msg: res.data.success}))
      
    }
  })
}

