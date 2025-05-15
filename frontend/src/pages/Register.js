// NOTE: IMPORTS ----------------------------------------------------------------------------------
import { useState } from 'react'
import {Link, useNavigate} from 'react-router'
import { useAuthContext } from '../hooks/useAuthContext'

// REGISTER
const Register = () => {

    // CONSTANTS/VARIABLES
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState(null)
    const { dispatch } = useAuthContext()

    // REGISTER FUNCTION
    const registerAttempt = async (e) => {
        e.preventDefault()

        // ATTEMPTING REGISTER
        try {
            const response = await fetch('http://localhost:7000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password, confirmPassword })
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
            setMessage("Registering was successful!")
            // NAVIGATING USER ON SUCCESSION
            setTimeout(() => {
                navigate('/')
            }, 2000)
        } catch (error) {
            // HANDLING ERROR
            console.error('Registering error:', error)
            setError("Registering error: " + error)
        }
    }

    // RETURNING VISUALS
    return (
        <div className="form-container">
            <form className="auth-form">
            <div className="single-input">
                    <label>Username:</label>
                    <input 
                        type="text"
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter new username..."
                    />
                </div>
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
                        placeholder="Enter new password..."
                    />
                </div>
                <div className="single-input">
                    <label>Confirm Password:</label>
                    <input 
                        type="password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Enter password again..."
                    />
                </div>
                {message &&
                <p className='pop-up-message'>{message}</p>
                }
                {error &&
                    <p className='pop-up-error'>{error}</p>
                }
                <button onClick={registerAttempt}>Register</button>
                <p>Already have an account? Login <Link to='/login'>HERE</Link></p>
            </form>
        </div>
    )
}

export default Register

// END OF DOCUMENT --------------------------------------------------------------------------------