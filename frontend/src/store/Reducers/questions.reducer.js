import { actionTypes } from "store/Actions/questions.action"

const initialState = {
    question: {},
    errors: {},
    questions: {
        current_page: 1,
        data: []
    },
    success: false,
}

const questionsReducer = (state = initialState, { type, payload, isLoadMore }) => {
    switch (type) {

        case actionTypes.CHANGE:
            return { ...state, ...payload }

        case actionTypes.ERRORS:
            return (
            payload === 'clear' ?
            { ...state, errors: {} }
            :
            { ...state, errors: payload }
        )

        case actionTypes.INDEX:
            payload = isLoadMore ? {
                ...payload, data: state.questions.data.concat(payload.data),
            }
                :
                payload
            return { ...state, questions: payload }

        case actionTypes.SHOW:
            return { ...state, question: payload }
        
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
