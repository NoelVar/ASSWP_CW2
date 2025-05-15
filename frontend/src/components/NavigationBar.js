// NOTE: IMPORTS ----------------------------------------------------------------------------------
import { Link } from "react-router-dom"
import Logout from "./Logout"
import { useAuthContext } from "../hooks/useAuthContext"

// NAVBAR
const NavigationBar = ({ role }) => {
    
    // CONSTANT/VARIABLES
    const { user } = useAuthContext()

    // RETURNING VISUAL COMPONENT
    return (
        <div className="navigation-bar">
            <ul>
                <div className="nav-left-side">
                    <li>
                        <Link to='/' className="logo">
                            <img src="/TravelTalesLogo.png" alt="TravelTales"></img>
                        </Link>
                    </li>
                </div>
                <div className="nav-right-side">
                    <li>
                        <Link to='/'>Home</Link>
                    </li>
                    <li>
                        <Link to='/posts'>Search</Link>
                    </li>   
                    {/* CONDITIONAL MENU POINTS */}
                    {user && 
                        <li>
                            <Link to='/my-profile'>My Profile</Link>
                        </li>
                    }
                    {user &&
                        <li>
                            <Logout />
                        </li>
                    }
                    {!user &&
                        <li>
                            <Link to='/login'>Login/Register</Link>
                        </li>
                    }
                </div>
            </ul>
        </div>
    )
}

export default NavigationBar
// END OF DOCUMENT --------------------------------------------------------------------------------