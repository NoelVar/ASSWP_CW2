// NOTE: IMPORTS ----------------------------------------------------------------------------------
import { PostContext } from "../context/PostContext";
import { useContext } from "react";

// CREATING "usePostContext" HOOK
export const usePostContext = () => {
    const context = useContext(PostContext)

    if (!context) {
        throw Error('usePostContext must be used inside an PostContext')
    }

    return context
}

// END OF DOCUMENT --------------------------------------------------------------------------------