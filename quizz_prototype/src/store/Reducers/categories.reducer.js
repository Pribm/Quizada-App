import { actionsTypes } from "store/Actions/categories.action"


const initialState = {
    category: {},
    categories: [],
    errors: {},
}

export default (state = initialState, { type, payload }) => {
    switch (type) {

        case actionsTypes.CHANGE:
            return payload === 'clear' ? initialState : { ...state, category: payload }


        case actionsTypes.INDEX:
            return { ...state, categories: payload.data }
        
        case actionsTypes.ERROR:
            return {...state, errors: payload}
        
        case actionsTypes.SUCCESS:
            return {...state, category: payload}
        

        default:
            return state
    }
}
