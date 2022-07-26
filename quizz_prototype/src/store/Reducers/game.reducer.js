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
      let scoreModifier = 0
      if(payload.quizz.time_per_question === 0) scoreModifier = 0;
      if(payload.quizz.time_per_question > 0) scoreModifier = .3;
      if(payload.quizz.time_per_question > 30) scoreModifier = .2;
      if(payload.quizz.time_per_question > 60) scoreModifier = .1;
      
      return payload === 'clear' ? initialState : {
        ...state,
        ...payload,
        quizz: {...state.quizz,
          ...payload.quizz,
          scoreModifier
        } 
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
    
    case actionTypes.RESTART_GAME:
      return initialState

  default:
    return state
  }
}

export default gameReducer
