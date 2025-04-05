// NOTE: IMPORTS ----------------------------------------------------------------------------------
import { Link } from "react-router-dom"

// PAGE NOT FOUND COMPONENT
const PageNotFound = () => {
    return (
        <div className="page-not-found">
            <h1>Error 404 - Page is not available</h1>
            <Link to='/'>Home</Link>
        </div>
    )
}

export default PageNotFound

// END OF DOCUMENT --------------------------------------------------------------------------------