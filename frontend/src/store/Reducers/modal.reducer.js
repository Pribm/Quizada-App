import { actionTypes } from '../Actions/modal.action'

const initialState = {
    open: false,
    modalComponent: 'default',
    modalTitle: 'dispatch a modalTitle state'
}

export default (state = initialState, { type, payload }) => {
  switch (type) {

  case actionTypes.CHANGE :
    return { ...state, ...payload }

  default:
    return state
  }
}
