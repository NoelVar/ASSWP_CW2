// NOTE: IMPORTS ----------------------------------------------------------------------------------
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

// COUNTRIES
const Countries = () => {

    // CONSTATS/VARIABLES
    const [countries, setCountries] = useState(null)
    const [activeKey, setActiveKey] = useState(false)
    const [searchPrompt, setSearchPrompt] = useState('')
    const [message, setMessage] = useState('')
    const [filteredCountries, setFilteredCountries] = useState(null)
    // RETRIEVING USER AND ID FROM LOCALSTORAGE
    const user = localStorage.getItem('user')
    const id = localStorage.getItem('id')

    // POP UP MESSAGE FUNCTION TO REUSE
    const popUpGenerator = (passedInData) => {
        setMessage(passedInData)
        setTimeout(() => {
            setMessage(null)
        }, 5000)
    }

    // FETCHING COUNTRIES USING REST API
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://restcountries.com/v3.1/all?fields=name,currencies,capital,languages,flags,flag')
                const json = await response.json()

                // VALIDATING RESPONSE
                if (!response.ok) {
                    popUpGenerator('Response is unavailable.')
                } else {
                    setCountries(json)
                    setFilteredCountries(json)
                }

            } catch (err) {
                // SENDING ERROR RESPONSE
                popUpGenerator("ERROR: " + err)
            }
        }

        // FETCHING USER
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:7000/user/single-user', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: id })
                })
                const json = await response.json()

                // VALIDATING RESPONSE
                if (!response.ok) {
                    popUpGenerator('Response is unavailable.')
                } else {
                    for(var i = 0; i < json.apikeys.length; i++) {
                        if (json.apikeys[i].status === 'active') {
                            setActiveKey(true)
                        }
                    }
                }

            } catch (err) {
                popUpGenerator(err.message)
            }
        }
        // ONLY RUNNING FUNCTIONS IF USER IS LOGGED IN
        {user &&
            fetchCountries() 
            fetchUser()
        }
    }, [])


    // SEARCH FUNCTION
    const handleSearch = (e) => {
        e.preventDefault()
        var searchData = countries.filter((country) => {
            return country.name.common.toLowerCase().includes(searchPrompt.toLowerCase())
        })
        setFilteredCountries(searchData)
    }

    // RETURNING VISUALS
    return (
        <div className="country-page">
            <h1>Search for countries!</h1>
            <form>
                <input
                    type="text"
                    placeholder="Search for a country..."
                    onChange={(e) => setSearchPrompt(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </form>
            <p className="instructions"><b>Note: &nbsp;</b> Hover over a flag to get information about a country!</p>
            <div className="all-counries">
                {countries && activeKey === true
                    ? 
                        filteredCountries.map((country) => {

                        const lang = Object.values(country.languages)
                        const curr = Object.values(country.currencies)

                        return(
                            <div className="country-card">
                                <div className="country-cover">
                                    <img src={country.flags.png} alt="Country's flag" />
                                </div>
                                <div className="country-information">
                                    <h3>{country.flag} {country.name.common} {country.flag}</h3>
                                    <div className="important-info">
                                        <p><b>Capital: </b> {country.capital[0]}</p>
                                        <p><b>Languages: </b>{lang.map((singleLang) => `${singleLang},   `)}</p>
                                        <p><b>Currenies: </b>{curr.map((singleCurr) => singleCurr.name)}</p>
                                        <p><b>Currenies' Symbol: </b>{curr.map((singleCurr) => singleCurr.symbol)}</p>
                                        {/* {Array.from({length: country})} */}
                                    </div>
                                </div>
                            </div>
                        )
                        })
                    : 
                        <div className="not-active-message">
                            <p>You need to activate an API key to view the contents.</p>
                            <Link to='/api' >API keys</Link>
                        </div>
                }
                {message && 
                    <p className="message-popup">{message}</p>
                }
            </div>
        </div>
    )
}

export default Countries

// END OF DOCUMENT --------------------------------------------------------------------------------