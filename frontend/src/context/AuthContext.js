// NOTE: IMPORTS ----------------------------------------------------------------------------------
import { createContext, useReducer, useEffect} from 'react'

// CREATING CONTEXT
export const AuthContext = createContext()

// CREATING REDUCER AND CASES
export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN': 
            return { user: action.payload }
        case 'LOGOUT':
            return { user: null}
        default:
            return state
    }
}

// CREATING CONTEXT PROVIDER
export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })

    // USING USEEFFECT TO CHECK IF USER IS ALREADY STORED IN LOCALSTORAGE
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))

        if (user) {
            dispatch({ type: 'LOGIN', payload: user })
        }
    },[])

    // RETURNING CONTEXT PROVIDER THAT WRAPPS AROUND THE 'children' COMPONENT (APP)
    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            { children }
        </AuthContext.Provider>
    )
}

// END OF DOCUMENT --------------------------------------------------------------------------------