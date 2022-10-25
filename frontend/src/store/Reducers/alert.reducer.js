import { actionTypes } from "../Actions/alert.action"

const initialState = {
    open: false,
    msg: 'Sucesso!',
    class: 'success',
    autoHideDuration: 2000
}

const alertReducer = (state = initialState, { type, payload }) => {
  switch (type) {

  case actionTypes.CHANGE:
    return { ...state, ...payload }

  default:
    return state
  }
}

export default alertReducer
