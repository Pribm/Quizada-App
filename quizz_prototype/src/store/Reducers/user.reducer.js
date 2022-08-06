import { actionTypes } from "store/Actions/user.action"

const initialState = {
    user: {},
    users: {
      data:[]
    },
    users_for_adm: {
      current_page: 0,
      data:[]
    },
    notifications_from: {
      current_page: 0,
      data: []
    },
    quizzInvitations: {
      current_page: 0,
      data: []
    },
    quizzComplete: {
      current_page: 0,
      data: [],
    },
    publicQuizz: {
      current_page: 0,
      data: [],
    },
    errors: []
}

const userReducer = (state = initialState, { type, payload, isLoadMore }) => {
  switch (type) {

  case actionTypes.CHANGE:
    return { ...state, user: {...state.user, ...payload} }

    case actionTypes.RANKING:
      if(isLoadMore){
        payload.users.data = state.users.data.concat(payload.users.data)
      }
      
      return {...state,
        user: {...state.user, score: payload.user.score, Ranking: payload.user.Ranking},
        users: {
          data: [...state.users.data, ...payload.users.data]
        }
    }

    case actionTypes.INDEX:
      return {
        ...state,
        user: payload.user ? payload.user : state.user,
        notifications_from: payload.notifications_from ? payload.notifications_from : state.notifications_from,
      }

    case actionTypes.GET_USERS_FOR_ADM:
          payload = isLoadMore ? {
            ...payload, data: state.users_for_adm.data.concat(payload.data),
            }
            : 
            payload

    return {...state, users_for_adm: payload}

    case actionTypes.GET_QUIZZ_INVITATIONS:
          payload = isLoadMore ? {
            ...payload, data: state.quizzInvitations.data.concat(payload.data),
            }
            : 
            payload

    return {...state, quizzInvitations: payload}

    case actionTypes.GET_QUIZZ_COMPLETE:
          payload = isLoadMore ? {
            ...payload, data: state.quizzComplete.data.concat(payload.data),
            }
            : 
            payload

    return {...state, quizzComplete: payload}

    case actionTypes.GET_PUBLIC_QUIZZ:
          payload = isLoadMore ? {
            ...payload, data: state.publicQuizz.data.concat(payload.data),
            }
            : 
            payload

    return {...state, publicQuizz: payload}
    
    case actionTypes.ERRORS:
      return {...state, errors: payload}

  default:
    return state
  }
}

export default userReducer
