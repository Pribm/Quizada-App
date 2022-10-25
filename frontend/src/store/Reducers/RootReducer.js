import { combineReducers } from "redux"
import loadingReducer from "./loading.reducer"
import authReducer from "./auth.reducer"
import alertReducer from "./alert.reducer"
import mainMenuReducer from "./mainMenu.reducer"
import quizzReducer from "./quizz.reducer"
import confirmReducer from "./confirm.reducer"
import categoriesReducer from "./categories.reducer"
import userReducer from "./user.reducer"
import questionsReducer from "./questions.reducer"
import gameReducer from "./game.reducer"
import timerReducer from "./timer.reducer"
import friendsReducer from "./friends.reducer"
import rulesReducer from "./rules.reducer"
import appReducer from "./app.reducer"
import modalReducer from "./modal.reducer"

const rootReducer = combineReducers({
    loadingReducer,
    authReducer,
    alertReducer,
    mainMenuReducer,
    quizzReducer,
    confirmReducer,
    categoriesReducer,
    userReducer,
    questionsReducer,
    gameReducer,
    timerReducer,
    friendsReducer,
    rulesReducer,
    appReducer,
    modalReducer
})

export default rootReducer