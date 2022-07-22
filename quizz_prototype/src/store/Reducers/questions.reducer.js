import { actionTypes } from "store/Actions/questions.action"

const initialState = {
    question: {},
    questions: [],
    success: false,
}

const questionsReducer = (state = initialState, { type, payload }) => {
    switch (type) {

        case actionTypes.CHANGE:
            return { ...state, ...payload }

        case actionTypes.INDEX:
            return { ...state, questions: payload }
        
        case actionTypes.SUCCESS:
            return {...state, success: payload}

        default:
            return state
    }
}

export default questionsReducer
