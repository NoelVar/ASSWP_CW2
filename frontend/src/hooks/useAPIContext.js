// NOTE: IMPORTS ----------------------------------------------------------------------------------
import { APIContext } from "../context/APIContext";
import { useContext } from "react";

// CREATING useAPIContext HOOK
export const useAPIContext = () => {
    const context = useContext(APIContext)

    if (!context) {
        throw Error('useAPIContext must be used inside an APIContextProvider')
    }

    return context
}

// END OF DOCUMENT --------------------------------------------------------------------------------