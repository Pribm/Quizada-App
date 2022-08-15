import { actionsTypes } from "store/Actions/timer.action"

const initialState = {
    remainingTime: null,
    endTime: 0,
    resetTimer: false,
    elapsedTime: 0,
}

const timerReducer = (state = initialState, { type, payload }) => {
  switch (type) {

  case actionsTypes.CHANGE:
    return { ...state, ...payload }

  default:
    return state
  }
}

export default timerReducer
