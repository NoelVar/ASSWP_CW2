// NOTE: IMPORTS ----------------------------------------------------------------------------------
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../hooks/useAuthContext"

// LOGOUT FUNCTION
const Logout = () => {

    // CONSTANTS/VARIABLES
    const navigate = useNavigate()
    const { dispatch } = useAuthContext()

    // HANDLING LOGOUT FUNCTION
    const handleLogout = (e) => {
        e.preventDefault()
        localStorage.clear()
        dispatch({type: 'LOGOUT'})
        navigate('/')
    }

    // VISUAL LOGOUT BUTTON 
    return (
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
    )
}

export default Logout

// END OF DOCUMENT --------------------------------------------------------------------------------