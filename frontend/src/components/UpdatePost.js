// IMPORTS ----------------------------------------------------------------------------------------
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// UPDATE POST COMPONENT --------------------------------------------------------------------------
const UpdatePost = ({selectedID}) => {
    // STATE VARIABLES AND RETRIEVED LOCALSTORAGE INFO
    const [countries, setCountries] = useState(null)
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [enteredContent, setEnteredContent] = useState('')
    const [selectedDate, setSelectedDate] = useState(null)
    const [enteredTitle, setEnteredTitle] = useState('')
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');

    useEffect(() => {
        // FETCHING COUNTRY DATA
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

        // FETCHING POST THAT WAS SELECTED
        const getPost = async () => {
            try {
                const response = await fetch('https://traveltales-backend.up.railway.app/post/single-post', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id: selectedID})
                })

                const json = await response.json()
        
                if (!response.ok) {
                    setError(json.error)
                    setTimeout(() => {
                        setError(null)
                    }, 4000)
                } else {
                    setSelectedCountry(json.country)
                    setSelectedDate(json.date)
                    setEnteredTitle(json.title)
                    setEnteredContent(json.content)
                }

            } catch (error) {
                // HANDLING ERROR
                console.error(error)
            }
        }


        fetchCountries()
        getPost()
    }, [])
    
    // HANDLING SUBMISSION OF UPDATING ------------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('https://traveltales-backend.up.railway.app/post/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    loggedInUser: email,
                    postID: selectedID,
                    title: enteredTitle,
                    content: enteredContent,
                    date: selectedDate,
                    country: selectedCountry,
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
                setMessage(json.message)
                setTimeout(() => {
                    setMessage(null)
                    window.location.reload()
                }, 2000)
            }

        } catch (err) {
            // SENDING ERROR RESPONSE
            console.error(err)
        }
    }

    // RETURNING VIEW -----------------------------------------------------------------------------
    return (
        <form onSubmit={handleSubmit}>
            <p>Only change fields you would like to update.</p>
            <div className='create-post-single-input'>
                <label>Date Visited ({new Date(selectedDate).toDateString()}):</label>
                <input
                    type='date'
                    onChange={e => setSelectedDate(e.target.value)}
                />
            </div>
            <div className='create-post-single-input'>
                <label>Visited Country:</label>
                <select required onChange={e => setSelectedCountry(e.target.value)}>
                    <option disabled selected hidden value={selectedCountry}>{selectedCountry}</option>
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
            <button type='submit' className='btn submmit-update'><i class="fa-solid fa-pen-to-square"></i> Update Post</button>
            {message &&
                <p className='pop-up-message'>{message}</p>
            }
            {error &&
                <p className='pop-up-error'>{error}</p>
            }
        </form>
    )
    }

export default UpdatePost

// END OF DOCUMENT --------------------------------------------------------------------------------