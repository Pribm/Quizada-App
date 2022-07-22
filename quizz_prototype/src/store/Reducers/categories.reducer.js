import { actionsTypes } from "store/Actions/categories.action"


const initialState = {
    category: {},
    categories: [],
    errors: {},
    createNewCategory: false
}

const categoriesReducer = (state = initialState, { type, payload }) => {
    switch (type) {

        case actionsTypes.CHANGE:
            return payload === 'clear' ? initialState : { ...state, ...payload }


        case actionsTypes.INDEX:
            return { ...state, categories: payload }
        
        case actionsTypes.ERROR:
            return {...state, errors: payload}
        
        case actionsTypes.SUCCESS:
            return {...state, category: payload}
        

        default:
            return state
    }
}

export default categoriesReducer
