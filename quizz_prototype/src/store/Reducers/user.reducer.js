import { actionTypes } from "store/Actions/user.action"

const initialState = {
    user: {},
    users: {
      data:[]
    },
    errors: []
}

const userReducer = (state = initialState, { type, payload, loadMoreUsers }) => {
  switch (type) {

  case actionTypes.CHANGE:
    return { ...state, user: {...state.user, ...payload} }

    case actionTypes.INDEX:
      if(loadMoreUsers){
        payload.users.data = state.users.data.concat(payload.users.data)
      }
      
      return {...state,user: payload.user, users: {
        data: [...state.users.data, ...payload.users.data]
      }
    }
    
    case actionTypes.ERRORS:
      return {...state, errors: payload}

  default:
    return state
  }
}

export default userReducer
