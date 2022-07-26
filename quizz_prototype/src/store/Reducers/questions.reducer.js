import { actionTypes } from "store/Actions/questions.action"

const initialState = {
    question: {},
    questions: {
        data: []
    },
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
        
        case actionTypes.DESTROY:
            return {...state, questions: {
                ...state.questions,
                data: state.questions.data.filter(q => !payload.includes(q.id))
            }}

        default:
            return state
    }
}

export default questionsReducer
