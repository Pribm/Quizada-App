import { actionTypes } from "../Actions/mainMenu.action"

const initialState = {
    open: false,
}

const mainMenu = (state = initialState, { type, payload }) => {
  switch (type) {

  case actionTypes.CHANGE:
    return { ...state, ...payload }

  default:
    return state
  }
}

export default mainMenu
