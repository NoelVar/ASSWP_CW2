// NOTE: IMPORTS ----------------------------------------------------------------------------------
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

// CREATING useAPIContext HOOK
export const useAuthContext = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw Error('useAuthContext must be used inside an AuthContextProvider')
    }

    return context
}

// END OF DOCUMENT --------------------------------------------------------------------------------