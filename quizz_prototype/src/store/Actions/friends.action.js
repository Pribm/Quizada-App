import { HttpAuth } from "config/Http"
import { getQuizzInvitations } from "./user.action"

export const actionTypes = {
    CHANGE: 'CHANGE_FRIENDS',
    INDEX: 'INDEX_FRIENDS',
    GET_FRIENDS: 'GET_FRIENDS',
    FRIENDSHIP_REQUESTS: 'FRIENDSHIP_REQUESTS',
    QUIZZ_REQUESTS: 'QUIZZ_REQUESTS',
    USER_FRIENDSHIP_REQUESTS: 'USER_FRIENDSHIP_REQUESTS',
    ADD: 'ADD_FRIEND',
    UNFOLLOW: 'UNFOLLOW_FRIEND',
    ACCEPT: 'ACCEPT_FRIEND',
    ACCEPT_QUIZZ: 'ACCEPT_FRIEND_QUIZZ'
}

export const change = (payload) => ({
  type: actionTypes.CHANGE,
  payload
})

const showUnfollowedUsersResponse = (payload, isLoadMore=false) => ({
  type: actionTypes.INDEX,
  payload,
  isLoadMore
})

const showAllFriendsResponse = (payload, isLoadMore=false) => ({
  type: actionTypes.GET_FRIENDS,
  payload,
  isLoadMore
})

const showFriendshipRequestsResponse = (payload, isLoadMore=false) => ({
  type: actionTypes.FRIENDSHIP_REQUESTS,
  payload,
  isLoadMore
})

const showQuizzRequestsResponse = (payload, isLoadMore=false) => ({
  type: actionTypes.QUIZZ_REQUESTS,
  payload,
  isLoadMore
})

const showUserFriendshipRequests = (payload, isLoadMore=false) => ({
  type: actionTypes.USER_FRIENDSHIP_REQUESTS,
  payload,
  isLoadMore
})

const addFriendResponse = (payload) => ({
  type: actionTypes.ADD,
  payload
})

const unfollowFriendResponse = (payload) => ({
  type: actionTypes.UNFOLLOW,
  payload
})

const acceptFriendResponse = (payload) => ({
  type: actionTypes.ACCEPT,
  payload
})

const acceptQuizzResponse = payload => ({
  type: actionTypes.ACCEPT_QUIZZ,
  payload
})

export const index = (payload, isLoadMore) => dispatch => {
    return HttpAuth.get('/user/friends', {params: {...payload}}).then(res => {
        if(res.status === 200){
            if(Object.keys(payload)[0] === 'showUnfollowedUsers'){
              dispatch(showUnfollowedUsersResponse(res.data, isLoadMore))
            }
            if(Object.keys(payload)[0] === 'showFriendshipRequests'){
              dispatch(showFriendshipRequestsResponse(res.data, isLoadMore))
            }
            if(Object.keys(payload)[0] === 'showUserFriendshipRequests'){
              dispatch(showUserFriendshipRequests(res.data, isLoadMore))
            }
            if(Object.keys(payload)[0] === 'showFriendsList'){
              dispatch(showAllFriendsResponse(res.data), isLoadMore)
            }
            if(Object.keys(payload)[0] === 'showQuizzRequests'){
              dispatch(showQuizzRequestsResponse(res.data), isLoadMore)
            }
        }
    })
}

export const addFriend = (id, payload) => dispatch => {
  HttpAuth.put('/user/friends/'+id, payload).then(res => {
    dispatch(addFriendResponse(res.data))
  })
}

export const unfollowFriend = (id, payload) => dispatch => {
  HttpAuth.put('/user/friends/'+id, payload).then(res => {
    dispatch(unfollowFriendResponse(res.data))
  })
}

export const acceptFriendshipInvitation = (id, payload) => dispatch => {
  HttpAuth.post('/user/friends/invitation-confirm/'+id, payload).then(res => {
    dispatch(acceptFriendResponse(res.data))
  })
}

export const acceptQuizzInvitation = id => dispatch => {
  HttpAuth.put('quizz/accept/'+id).then(res => {
    dispatch(acceptQuizzResponse(res.data))
    dispatch(getQuizzInvitations({showAcceptedQuizzList: true}))
  })
}