import { actionsTypes } from "store/Actions/categories.action"


const initialState = {
    category: {
        id: 0
    },
    categories: {
        data: []
    },
    errors: {},
    createNewCategory: false
}

const categoriesReducer = (state = initialState, { type, payload }) => {
    switch (type) {

        case actionsTypes.CHANGE:
            return payload === 'clear' ? initialState : { ...state, category: payload }

        case actionsTypes.INDEX:
            return { ...state, categories: { data: Object.values(payload)} }

        case actionsTypes.DESTROY:
            return { ...state, categories: {data: state.categories.data.filter(c => c.id !== payload)}}
        
        case actionsTypes.ERROR:
            return {...state, errors: payload}
        
        case actionsTypes.SUCCESS:
            return {...state, category: payload}
        

        default:
            return state
    }
}

export default categoriesReducer
