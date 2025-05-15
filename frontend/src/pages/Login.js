// NOTE: IMPORTS ----------------------------------------------------------------------------------
import { useState } from 'react'
import {Link, useNavigate} from 'react-router'
import { useAuthContext } from '../hooks/useAuthContext'

// LOGIN
const Login = () => {

    // CONSTANTS/VARIABLES
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState(null)
    const { dispatch } = useAuthContext()

    // LOGIN FUNCTION
    const loginAttempt = async (e) => {
        e.preventDefault()

        // ATTEMPTING LOGIN
        try {
            const response = await fetch('https://traveltales-backend.up.railway.app/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()
            
            // VALIDATING RESPONSE
            if (!response.ok) {
                setError(data.message)
                return
            }

            // SETTING LOCAL STORAGE
            localStorage.setItem('user', JSON.stringify(data.user))
            localStorage.setItem('id', data.user.id)
            localStorage.setItem('email', data.user.email)
            localStorage.setItem('token', data.user.token)
            // DISPATCHING LOGIN ACTION
            dispatch({type: 'LOGIN', payload: data.user})
            // SETTING useStates
            setError(null)
            setMessage("Login was successful!")
            // NAVIGATING TO COUNTRIES
            setTimeout(() => {
                navigate('/')
            }, 2000)
        } catch (error) {
            // CATHING ERRORS
            console.error('Login error:', error)
            setError("Login error: " + error)
        }
    }

    // RETURN VISUALS
    return (
        <div className="form-container">
            <form className="auth-form">
                <div className="single-input">
                    <label>Email Address:</label>
                    <input 
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address..."
                    />
                </div>
                <div className="single-input">
                    <label>Password:</label>
                    <input 
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password..."
                    />
                </div>
                {message &&
                <p className='pop-up-message'>{message}</p>
                }
                {error &&
                    <p className='pop-up-error'>{error}</p>
                }
                <button onClick={loginAttempt}>Login</button>
                <p>Doesn't have an account yet? Register <Link to='/register'>HERE</Link></p>
            </form>
        </div>
    )
}

export default Login

// END OF DOCUMENT --------------------------------------------------------------------------------