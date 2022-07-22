import { configureStore } from '@reduxjs/toolkit'
import ReduxThunk from 'redux-thunk'

import Reducers from './store/Reducers/RootReducer'


let middlewares = [ReduxThunk]

const store = configureStore({reducer: Reducers, middleware: getDefaultMiddleware => getDefaultMiddleware(
    {
        serializableCheck: {
            ignoredActions: ['CHANGE_CONFIRM'],
            ignoredPaths: ['confirmReducer.confirmAction', 'userReducer.userAction', 'friendsReducer.friendsAction']
        },
        immutableCheck: {
            // Ignore state paths, e.g. state for 'items':
            ignoredPaths: ['userReducer.users.data', 'friendsReducer.yourFriends.data']
        },
    }
).concat(middlewares)})

export {store}