import { actionTypes } from "../Actions/auth.action"

const initialState = {
  credentials: {
    email: '',
    password: '',
    provider: '',
    accesToken: '',
  },
  authenticated: false,
  success: false,
  errors: {},
}

const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {

    case actionTypes.CHANGE:
      return {
        ...state, credentials: {
          ...state.credentials,
          ...payload
        }
      }

    case actionTypes.SUCCESS:
      return { ...state, success: payload }

    case actionTypes.ERROR:
      return { ...state, errors: payload }

    default:
      return state
  }
}

export default authReducer
