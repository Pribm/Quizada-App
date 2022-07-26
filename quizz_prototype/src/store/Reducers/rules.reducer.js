import { actionTypes } from "store/Actions/rules.action"

const initialState = {
    open: false,
    rules: {
        withTime: false,
        count_time: 0,
        time_per_question: 0,
        shuffle_questions: true,
        shuffle_answers: true,
        limitNumQuestions: false,
        numQuestions: 0,
    },
}

const rulesReducer = (state = initialState, { type, payload }) => {
  switch (type) {
  case actionTypes.CHANGE:
    
    return payload === 'clear' ? initialState : {
      ...state,
      ...payload,
      rules: {
        ...state.rules,
        ...payload.rules
      }
    }

  default:
    return state
  }
}

export default rulesReducer
