import { actionTypes } from "store/Actions/rules.action"

const initialState = {
    open: false,
    rules: {
        withTime: false,
        count_time: 'none',
        time_per_question: 0,
        shuffle_questions: true,
        shuffle_answers: true,
        limitNumQuestions: false,
        limit_questions: 0,
        category_id: 0,
        public_quizz: 0
    },
    quizzToken: null,
    state: 'create'
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

  case actionTypes.SHOW:
    return {
      ...state,
      rules: {
        ...state.rules,
        ...payload
      }
    }
  default:
    return state
  }
}

export default rulesReducer
