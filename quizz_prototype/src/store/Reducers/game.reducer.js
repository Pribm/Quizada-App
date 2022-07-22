import { actionTypes } from "store/Actions/game.action"

const initialState = {
    quizz: {
      withTime: false,
      scoreModifier: 0,
      currentQuestion: 0,
      answer: '',
      quizzCreated: false,
      quizzComplete: false
    },
    questions: [],
    correctAnswers: [],
    wrongAnswers: [],
}

const gameReducer = (state = initialState, { type, payload }) => {
  switch (type) {

  case actionTypes.CHANGE:
    return payload === 'clear' ? initialState : { ...state, quizz: {...state.quizz, ...payload} }
  
    case actionTypes.CREATE:
      return payload === 'clear' ? initialState : {
        ...state,
        ...payload,
        quizz: {...state.quizz, ...payload.quizz}
      }

    case actionTypes.ANSWER:
      return payload.answer === state.questions[state.quizz.currentQuestion].correct_answer ?
      {...state,
      correctAnswers: [...state.correctAnswers, payload]}
      :
      {
        ...state,
        wrongAnswers: [...state.wrongAnswers, {...payload, score: 0}]
      }

  default:
    return state
  }
}

export default gameReducer
