// NOTE: IMPORTS ----------------------------------------------------------------------------------
import { Link } from "react-router-dom"

// PAGE NOT FOUND COMPONENT
const PageNotFound = () => {
    return (
        <div className="page-not-found">
            <h1>Error 404 - Page is not available</h1>
            <p>Either the page does not exists or you need to login to visit it!</p>
            <div className="not-found-btn">
                <Link to='/'>Home</Link>
                <span>or</span>
                <Link to='/login'>Login</Link>
            </div>
        </div>
    )
}

export default PageNotFound

// END OF DOCUMENT --------------------------------------------------------------------------------