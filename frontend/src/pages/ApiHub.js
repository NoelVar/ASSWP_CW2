// NOTE: IMPORTS ----------------------------------------------------------------------------------
import { useEffect, useState } from "react"
import { useAPIContext } from "../hooks/useAPIContext"

// API HUB
const ApiHub = () => {

    // CONSTANTS/VARIABLES
    const {keys, dispatch} = useAPIContext()
    const [message, setMessage] = useState(null)
    const [selected, setSelected] = useState(null)

    // GETTING TOKEN FROM LOCAL STORAGE
    const token = localStorage.getItem('token')
    // RETRIEVING EMAIL FROM LOCAL STORAGE
    const email = localStorage.getItem('email')

    // POP UP MESSAGE FUNCTION TO REUSE
    const popUpGenerator = (passedInData) => {
        setMessage(passedInData)
        setTimeout(() => {
            setMessage(null)
        }, 5000)
    }

    // FETCHING ALL KEYS FOR USER
    useEffect(() => {
        const getAllKeys = async () => {
            // ATTEMPTING TO GET ALL USER KEYS
            try {
                const response = await fetch('http://localhost:7000/api/all-user-keys', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ email })
                })

                // SETTING KEYS IF RESPONSE WAS OKAY
                if (response.ok) {
                    const data = await response.json()
                    dispatch({type: 'SET_KEYS', payload: data})
                }
            } catch (err) {
                // CATCHING ERRORS AND DISPLAYING MESSAGE
                popUpGenerator("Something went wrong! Could not fetch keys!")
            }
        }
        // MAKING SURE EMAIL AND TOKEN IS SET BEFORE CALLING THE FUNCTION
        if (email && token) {
            getAllKeys()
        }
    }, [])

    // HANDLING API KEY GENERATION
    const handleGeneration = async (e) => {
        e.preventDefault()
        // RETRIEVING ID FROM LOCAL STORAGE
        const id = localStorage.getItem('id')

        // ATTEMPTING TO GENERATE KEY
        try {
            const response = await fetch('http://localhost:7000/api/generate-key', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id })
            })

            const data = await response.json()

            // CHECKING IF RESPONSE IS OKAY
            if (!response.ok) {
                popUpGenerator(data.message)
                return
            }
            
            if (response.ok) {
                popUpGenerator(data.message)
                dispatch({type: 'GENERATE_KEYS', payload: data.key[0]})
                // DEBUG: NOT USED FOR DEPLOYED VERSION DUE TO REFRESH BUG
                // setTimeout(() => {
                //     window.location.reload()
                // }, 3000)
            }
            
        } catch (err) {
            // CHECKING FOR ERRORS
            popUpGenerator(err.message)
            return
        }
    }

    // HANDLING ACTIVATION FUNCTION
    const handleActivation = async (e) => {
        e.preventDefault()

        // VALIDATING
        if (!selected) {
            popUpGenerator("Please select an API key!")
            return 
        }

        // ATTEMPTING TO ACTIVATE KEY
        try {
            const response = await fetch('http://localhost:7000/api/activate-key', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id: selected, email })
            })
            const data = await response.json()

            // CHECKING IF RESPONSE IS OKAY
            if (!response.ok) {
                popUpGenerator(data.message)
                return
            }
            if (response.ok) {
                popUpGenerator("Selected API key has been activated!")
                // DEBUG: NOT USED FOR DEPLOYED VERSION DUE TO REFRESH BUG
                // setTimeout(() => {
                //     window.location.reload()
                // }, 3000)
            }
            
            
        } catch (err) {
            // GENERATING MESSAGE IF ERROR OCCURED
            popUpGenerator(err.message)
            return
        }
    }
    
    // HANDLING DEACTIVATION OF KEY
    const handleDeactivation = async (e) => {
        e.preventDefault()
        
        // ATTEMPTING TO DEACTIVATE KEYS
        try {
            const response = await fetch('http://localhost:7000/api/deactivate-key', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email })
            })
            const data = await response.json()

            // CHECKING IF RESPONSE IS OKAY
            if (!response.ok) {
                popUpGenerator(data.message)
                return
            }  

            if (response.ok) {
                popUpGenerator(data.message)
                // DEBUG: NOT USED FOR DEPLOYED VERSION DUE TO REFRESH BUG
                // setTimeout(() => {
                //     window.location.reload()
                // }, 3000)
            }
            
        } catch (err) {
            // SENDING MESSAGE IF ERROR HAS OCCOURED
            popUpGenerator(err.message)
            return
        }
    }

    // HANDLING DELETION OF KEY
    const handleDelete = async (e) => {
        e.preventDefault()
        
        // VALIDATION
        if (!selected) {
            popUpGenerator("Please select an API key!")
            return 
        }

        // ATTEMPTING TO DELETE KEY
        try {
            const response = await fetch('http://localhost:7000/api/delete-key', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id: selected, email })
            })
            const data = await response.json()

            // CHECKING IF RESPONSE IS OKAY
            if (!response.ok) {
                popUpGenerator(data.message)
                return
            }
            if (response.ok) {
                popUpGenerator("Selected API key has been deleted!")
                // DEBUG: NOT USED FOR DEPLOYED VERSION DUE TO REFRESH BUG
                // setTimeout(() => {
                //     window.location.reload()
                // }, 3000)
            }
            
            
        } catch (err) {
            // SENDING ERROR MESSAGE IF ONE HAS OCCOURED
            popUpGenerator(err.message)
            return
        }
    }

    // RETURNING VISUALS
    return (
        <div className="api-hub">
            <h1>Api Hub</h1>
            <div className="generate-container">
                <h2>Generate new key</h2>
                <p>Generate up to 10 API keys which you can use to access the countries.</p>
                <button onClick={handleGeneration}>Generate new key</button>
                {message && 
                    <p className="message-popup">{message}</p>
                }
            </div>
            <div className="user-keys">
                <table>
                    <tr>
                        <th colSpan={2}>
                            Your current API keys
                        </th>
                    </tr>
                    {keys &&
                        keys.map((key, i) => (
                            <tr>
                                <th>API key {i+1}: </th>
                                <td style={key.status == 'active' ? {color:"white"} : {color:'gray'}}>
                                    <input 
                                        type="radio" 
                                        name="radio"
                                        onClick={(e) => setSelected(key._id)}
                                    />
                                    <label>{key.key}</label>
                                </td>
                            </tr>
                        ))
                    } 
                    {keys && keys.length===0 && 
                        <tr>
                            <td className="no-keys"><i>You dont have any api keys yet!</i></td>
                        </tr>
                    }
                </table>
                <div className="api-action-container">
                    <button onClick={handleActivation}>Activate selected key</button>
                    <button className="deactivate-btn" onClick={handleDeactivation}>Deactivate all keys</button>
                    <button className="deactivate-btn" onClick={handleDelete}>Delete Key</button>
                </div>
            </div>
        </div>
    )
}

export default ApiHub

// END OF DOCUMENT --------------------------------------------------------------------------------