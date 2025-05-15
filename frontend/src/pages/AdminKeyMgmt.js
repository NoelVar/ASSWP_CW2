// NOTE: IMPORTS ----------------------------------------------------------------------------------
import { useEffect, useState } from "react"

// ADMIN KEY MANAGEMENT
const AdminKeyMgmt = () => {

    // CONSTANTS/VARIABLES
    const [allKeys, setAllKeys] = useState(null)
    const [message, setMessage] = useState(null)
    const [selected, setSelected] = useState(null)
    const [email, setEmail] = useState(null)

    // CREATING POP GENERATOR FUNCTION
    const popUpGenerator = (passedInData) => {
        setMessage(passedInData)
        setTimeout(() => {
            setMessage(null)
        }, 5000)
    }

    // GETTING TOKEN FROM LOCAL STORAGE
    const token = localStorage.getItem('token')

    // FETCHING ALL KEYS
    useEffect(() => {
        const getAllKeys = async () => {
            try {
                const response = await fetch('https://traveltales-backend.up.railway.app/api/get-all-keys', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                // CHECKING RESPONSE AND SETTING KEYS
                if (response.ok) {
                    const data = await response.json()
                    setAllKeys(data)
                }

            } catch (err) {
                // CHECKING FOR ERRORS
                popUpGenerator("Could not fetch data!")
            }
        }

        getAllKeys()
    }, [])

    // HANDKING DELETION OF KEY
    const handleDelete = async (e) => {
        e.preventDefault()

        // VALIDATION
        if (!selected) {
            popUpGenerator("Please select an API key!")
            return 
        }
        if (!email) {
            popUpGenerator("Couldnt select user!")
            return
        }

        // ATTEMPTING TO REMOVE KEY
        try {
            const response = await fetch('https://traveltales-backend.up.railway.app/api/delete-key', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id: selected, email })
            })
            const data = await response.json()

            // CHECKING IF RESPONSE WAS OKAY
            if (!response.ok) {
                popUpGenerator(data.message)
                return
            }
            if (response.ok) {
                popUpGenerator("The selected API key has been deleted from the user!")
                setTimeout(() => {
                    window.location.reload()
                }, 3000)
            }
            
            
        } catch (err) {
            // RETURNING ERROR
            popUpGenerator(err.message)
            return
        }
    }

    // RETURNING VISUAL COMPONENT
    return (
        <div className="api-hub">
            <h1>Admin Key Management</h1>
            {message && 
                <p className="message-popup">{message}</p>
            }
            <table className="all-keys-table">
            {allKeys
                ?
                 allKeys.map((user) => (
                    user.apikeys.map((key) => (
                        <tr>
                            <th>{user.username}</th>
                            <td>
                                <input 
                                    type="radio" 
                                    name="radio"
                                    onClick={(e) => setSelected(key._id) + setEmail(user.email)}
                                />
                                <label>{key.key}</label>
                            </td>
                            <td style={key.status == 'active' ? {color:"green"} : {color:'red'}}>{key.status}</td>
                        </tr>
                    ))
                 ))
                : <p>Couldn't get User</p>
             
            }
            </table>
            <div className="admin-actions">
                <button className="deactivate-btn" onClick={handleDelete}>Delete Key</button>
            </div>
        </div>
    )
}

export default AdminKeyMgmt

// END OF DOCUMENT --------------------------------------------------------------------------------