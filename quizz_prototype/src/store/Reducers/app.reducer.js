import { actionTypes } from "store/Actions/app.action"


const initialState = {
    appData: {},
    errors: {}
}

export default (state = initialState, { type, payload }) => {
  switch (type) {

  case actionTypes.CHANGE:
    return { ...state, appData: {
        ...state.appData,
        ...payload
    }
  }

  case actionTypes.ERRORS:
    return { ...state, errors: payload}

  case actionTypes.INDEX:
    return { ...state, appData: payload}

  default:
    return state
  }
}
