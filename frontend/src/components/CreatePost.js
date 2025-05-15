// IMPORTS ----------------------------------------------------------------------------------------
import { useEffect, useState } from 'react';
import { usePostContext } from '../hooks/usePostContext';

// CREATE POST ------------------------------------------------------------------------------------
const CreatePost = () => {

    // VARIABLES & CONSTANTS (STATE VARIABLES)
    const { dispatch } = usePostContext()
    const [countries, setCountries] = useState(null)
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [enteredContent, setEnteredContent] = useState('')
    const [selectedDate, setSelectedDate] = useState(null)
    const [enteredTitle, setEnteredTitle] = useState('')
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');

    // USEEFFECT TO RETRIEVE DATA ON LOAD
    useEffect(() => {
        // RETRIEVING COUNTRY DATA & SAVING DATA IN A STATE VARIABLES
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://restcountries.com/v3.1/all?fields=name,currencies,capital,languages,flags,flag')
                const json = await response.json()

                // VALIDATING RESPONSE
                if (!response.ok) {
                    console.log(response)
                } else {
                    setCountries(json)
                }

            } catch (err) {
                // SENDING ERROR RESPONSE
                console.error(err)
            }
        }
        fetchCountries()
    }, [])

    // HANDLING SUBMITION OF POST CREATIONS -------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:7000/post/new-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: enteredTitle,
                    content: enteredContent,
                    date: selectedDate,
                    country: selectedCountry,
                    poster: email
                })
            })
            const json = await response.json()

            // VALIDATING RESPONSE
            if (!response.ok) {
                setError(json.error)
                setTimeout(() => {
                    setError(null)
                }, 4000)
            } else {
                dispatch({type: 'CREATE_POST', payload: json.post})
                setMessage(json.message)
                setTimeout(() => {
                    setMessage(null)
                }, 4000)
                setSelectedCountry(null)
                setEnteredContent('')
                setSelectedDate(null)
                setEnteredTitle('')
            }

        } catch (err) {
            // SENDING ERROR RESPONSE
            console.error(err)
        }
    }

    // RETURNING VIEW -----------------------------------------------------------------------------
    return (
        <div className='create-post-component'>
            <form onSubmit={handleSubmit}>
                <div className='create-post-single-input'>
                    <label>Date Visited:</label>
                    <input
                        type='date'
                        required
                        onChange={e => setSelectedDate(e.target.value)}
                    />
                </div>
                <div className='create-post-single-input'>
                    <label>Visited Country:</label>
                    <select required onChange={e => setSelectedCountry(e.target.value)}>
                        <option disabled selected hidden value={null}>Select a country</option>
                        {countries && countries.map((country) => (
                            <option value={country.name.common}>{country.flag}&nbsp;{country.name.common}</option>
                        ))}
                    </select>
                </div>
                <input
                    type='text'
                    placeholder='Enter Title...'
                    required
                    onChange={e => setEnteredTitle(e.target.value)}
                    value={enteredTitle}
                />
                <textarea 
                    placeholder='Enter Content...'
                    required
                    className='content-field'
                    onChange={e => setEnteredContent(e.target.value)}
                    value={enteredContent}
                />
                <button type='submit'><i class="fa-solid fa-pen-to-square"></i> Create Post</button>
            </form>
            {message &&
            <p className='pop-up-message'>{message}</p>
            }
            {error &&
                <p className='pop-up-error'>{error}</p>
            }
        </div>
    )
}

export default CreatePost

// END OF DOCUMENT --------------------------------------------------------------------------------