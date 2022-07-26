import { actionTypes } from "store/Actions/friends.action"

const initialState = {
    friend: {

    },
    friendsList: {
      current_page: 1,
      last_page: 1,
      data: []
    },
    yourFriends: {
      current_page: 1,
      last_page: 1,
      data: []
    },
    friendship_requests: {
      current_page: 1,
      last_page: 1,
      data: []
    },
    user_friendship_requests: {
      current_page: 1,
      last_page: 1,
      data: []
    },
    user_quizz_requests: {
      current_page: 1,
      last_page: 1,
      data: []
    },
    isLoading: true,
}

const friendsReducer = (state = initialState, { type, payload, isLoadMore}) => {
  switch (type) {

  case actionTypes.CHANGE:
    return { ...state, ...payload }

    case actionTypes.INDEX:
          payload = isLoadMore ? {
            ...payload, data: state.friendsList.data.concat(payload.data),
            }
            : 
            payload

    return {...state, friendsList: payload}

    case actionTypes.ALL_FRIENDS:
          payload = isLoadMore ? {
            ...payload, data: state.yourFriends.data.concat(payload.data),
            }
            : 
            payload

    return {...state, yourFriends: payload}

    case actionTypes.FRIENDSHIP_REQUESTS:
          payload = isLoadMore ? {
            ...payload, data: state.friendship_requests.data.concat(payload.data),
            }
            : 
            payload

    return {...state, friendship_requests: payload}

    case actionTypes.USER_FRIENDSHIP_REQUESTS:
          payload = isLoadMore ? {
            ...payload, data: state.user_friendship_requests.data.concat(payload.data),
            }
            : 
            payload

    return {...state, user_friendship_requests: payload}

    case actionTypes.QUIZZ_REQUESTS:
          payload = isLoadMore ? {
            ...payload, data: state.user_quizz_requests.data.concat(payload.data),
            }
            : 
            payload

    return {...state, user_quizz_requests: payload}

    case actionTypes.ADD:
      return { ...state, friendsList: {
        ...state.friendsList,
        data: state.friendsList.data.map(el => el.id === payload.id ? payload : el)
      }
    }

    case actionTypes.ACCEPT:
      return { ...state, friendship_requests: {
        ...state.friendship_requests,
        data: state.friendship_requests.data.filter(el => el.id !== payload.user.id)
      }
    }

    case actionTypes.ACCEPT_QUIZZ:
      return {...state, user_quizz_requests: {
        ...state.user_quizz_requests,
        data: state.user_quizz_requests.data.filter(qr => qr.id !== payload.id)
      }}

  default:
    return state
  }
}

export default friendsReducer
