import { actionTypes } from "../Actions/confirm.action"

const initialState = {
    open: false,
    title: 'Você está certo disso?',
    msg: 'Caso saia, você perderá todo o seu progresso até aqui.',
    confirmAction: null
}

const confirmReducer = (state = initialState, { type, payload }) => {
  switch (type) {

  case actionTypes.CHANGE:
    return { ...state, ...payload }

  default:
    return state
  }
}

export default confirmReducer
