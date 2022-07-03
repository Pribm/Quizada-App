import { actionTypes } from "../Actions/quizz.action"

const initialState = {
    gameMode: '',
    quizzCategory: '',
    numQuestions: 0,
    questionTime: 60,
    dificulty: '',
    creatingNewQuizz: false,
    upLoadingNewQuizz: false,
    uploadNewQuizzSuccess: false,
    questions: [
        
    ],
    newQuizz: {
      category: '',
      title: '',
      description: '',
      createWithfile: false,
      image: '',
      question_file: ''
    },
    errors: [],
}

const quizzReducer = (state = initialState, { type, payload }) => {
  switch (type) {

  case actionTypes.CHANGE:
    return payload === 'clear' ? initialState : { ...state, ...payload }
  
  case actionTypes.ERROR:
    return {
      ...state,
      errors: payload
    }

  default:
    return state
  }
}

export default quizzReducer
