import { configureStore } from '@reduxjs/toolkit'
import ReduxThunk from 'redux-thunk'

import Reducers from './store/Reducers/RootReducer'

let middlewares = [ReduxThunk]

const store = configureStore({reducer: Reducers}, [...middlewares])

export {store}