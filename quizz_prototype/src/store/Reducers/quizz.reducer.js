import { actionTypes } from "../Actions/quizz.action"

const initialState = {
  creatingNewQuizz: false,
  upLoadingNewQuizz: false,
  success: false,
  newQuizz: {
    category: {
      name: '',
      id: 0
    },
    title: '',
    description: '',
    createWithfile: false,
    image: '',
    question_file: ''
  },
  quizz: [],
  questions: [],
  quizz_list: {
    current_page: 0,
    data: []
  },
  token: '',
  errors: [],
}

const quizzReducer = (state = initialState, { type, payload, isLoadMore }) => {
  switch (type) {

    case actionTypes.CHANGE:
      return payload === 'clear' ? initialState : { ...state, ...payload }

    case actionTypes.SUCCESS:
      return { ...state, success: payload }

    case actionTypes.ERROR:
      return {
        ...state,
        errors: payload
      }

    case actionTypes.INDEX:
      payload = isLoadMore ? {
        ...payload, data: state.quizz_list.data.concat(payload.data),
      }
        :
        payload

      return { ...state, quizz_list: payload }

    case actionTypes.SHOW:
      return { ...state, questions: payload }

    case actionTypes.DESTROY:
      return {
        ...state,
        quizz_list: {
          ...state.quizz_list,
          data: state.quizz_list.data.filter(q => q.id !== payload)
        }
      }

    default:
      return state
  }
}

export default quizzReducer
