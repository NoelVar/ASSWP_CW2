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
                        <Link to='/' className="logo">CountryCatalogue</Link>
                    </li>
                </div>
                <div className="nav-right-side">
                    <li>
                        <Link to='/'>Home</Link>
                    </li>
                    {/* CONDITIONAL MENU POINTS */}
                    {user &&
                        <li>
                            <Link to='/countries'>Countries</Link>
                        </li>
                    }
                    {user &&
                        <li>
                            <Link to='/api'>API keys</Link>
                        </li>
                    }
                    {user && role && role === 'admin' &&
                        <li>
                            <Link to='/manage-keys'>Manage keys</Link>
                        </li>
                    }
                    {user &&
                        <li>
                            <Logout />
                        </li>
                    }
                    {!user &&
                        <li>
                            <Link to='/login'>Login</Link>
                        </li>
                    }
                </div>
            </ul>
        </div>
    )
}

export default NavigationBar
// END OF DOCUMENT --------------------------------------------------------------------------------