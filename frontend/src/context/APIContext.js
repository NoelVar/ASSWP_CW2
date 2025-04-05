// NOTE: IMPORTS ----------------------------------------------------------------------------------
import { createContext, useReducer} from 'react'

// CREATING CONTEXT
export const APIContext = createContext()

// CREATING REDUCER AND CASES
export const APIReducer = (state, action) => {
    switch (action.type) {
        case 'SET_KEYS': 
            return { keys: action.payload }
        case 'GENERATE_KEYS':
            return { keys: [...state.keys, action.payload]}
        default:
            return state
    }
}

// CREATING CONTEXT PROVIDER
export const APIContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(APIReducer, {
        keys: null
    })

    // RETURNING CONTEXT PROVIDER THAT WRAPPS AROUND THE 'children' COMPONENT (APP)
    return (
        <APIContext.Provider value={{...state, dispatch}}>
            { children }
        </APIContext.Provider>
    )
}

// END OF DOCUMENT --------------------------------------------------------------------------------