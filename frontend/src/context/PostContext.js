// NOTE: IMPORTS ----------------------------------------------------------------------------------
import { createContext, useReducer } from "react";

// CREATING CONTEXT
export const PostContext = createContext()

// CREATING REDUCER AND CASES
export const postReducer = (state, action) => {
    switch (action.type) {
        case 'SET_POSTS': 
            return {
                posts: action.payload
            }
        case 'CREATE_POST': 
            return {
                posts: [action.payload, ...state.posts]
            }
        case 'DELETE_POST':
            return { 
                ...state,
                posts: state.posts.filter((post) => post._id !== action.payload)
            }
    }
}

// CREATING CONTEXT PROVIDER
export const PostContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(postReducer, {
        posts: null,
    })

    // RETURNING CONTEXT PROVIDER THAT WRAPPS AROUND THE 'children' COMPONENT (APP)
    return (
        <PostContext.Provider value={{...state, dispatch}}>
            { children }
        </PostContext.Provider>
    )
}

// END OF DOCUMENT --------------------------------------------------------------------------------