import { actionTypes } from "../Actions/loading.action"

const initialState = {
    open: false,
    text: 'carregando...'
}

const loadingReducer = (state = initialState, { type, payload }) => {
  switch (type) {

  case actionTypes.CHANGE:
    return { ...state, ...payload }

  default:
    return state
  }
}

export default loadingReducer
