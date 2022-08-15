import { HttpAuth } from "config/Http"
import { changeAlert } from "./alert.action"

export const actionTypes = {
    CHANGE: 'GAME_CHANGE',
    CREATE: 'GAME_CREATE',
    ANSWER: 'GAME_ANSWER',
    RESTART_GAME: 'GAME_RESTART'
}

export const change = (payload) => ({
  type: actionTypes.CHANGE,
  payload
})

const createResponse = (payload) => ({
  type: actionTypes.CREATE,
  payload
})

export const create = payload => dispatch => {
  return HttpAuth.post('quizz', {...payload}).then(res => {
    dispatch(createResponse(res.data))
  })
}

export const show = token => dispatch => {
  return HttpAuth.get('quizz/' + token).then(res => {
    dispatch(createResponse(res.data))
    dispatch(change({quizzCreated: true}))
  })
}

export const answerQuestion = payload => ({
  type: actionTypes.ANSWER,
  payload
})

export const finishGame = payload => dispatch => {
  return HttpAuth.post('quizz/score', payload).then(res => {
    if(res.data.success){
      dispatch(changeAlert({open: true, msg: res.data.success, class: 'success', autoHideDuration: 5000}))
    }
    if(res.data.error){
      dispatch(changeAlert({open: true, msg: res.data.error, class: 'error', autoHideDuration: 5000}))
    }
  })
}

export const restartGame = (payload) => ({
  type: actionTypes.RESTART_GAME,
  payload
})




