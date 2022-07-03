import { combineReducers } from "redux"
import loadingReducer from "./loading.reducer"
import authReducer from "./auth.reducer"
import alertReducer from "./alert.reducer"
import mainMenuReducer from "./mainMenu.reducer"
import quizzReducer from "./quizz.reducer"
import confirmReducer from "./confirm.reducer"
import categoriesReducer from "./categories.reducer"

const rootReducer = combineReducers({
    loadingReducer,
    authReducer,
    alertReducer,
    mainMenuReducer,
    quizzReducer,
    confirmReducer,
    categoriesReducer
})

export default rootReducer