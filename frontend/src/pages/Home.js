// IMPORTS ----------------------------------------------------------------------------------------
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// HOME PAGE --------------------------------------------------------------------------------------
const Home = () => {

    // VARIABLES, LOCAL STORAGE INFO AND STATE VARIABLES
    const [posts, setPosts] = useState(null)
    const [users, setUsers] = useState(null)
    const [countries, setCountries] = useState(null)
    const loggedInUserID = localStorage.getItem('id');
    var username = 'Anonymous'

    // USEEFFECT TO RETRIEVE DATA ON LOAD
    useEffect(() => {
        // RETRIEVING POPULAR POSTS
        const getPosts = async () => {
            try {
                const response = await fetch('https://traveltales-backend.up.railway.app/post/get-popular-posts')
        
                // CHECKING RESPONSE
                if (response.ok) {
                    const data = await response.json()
                    setPosts(data)
                    console.log(data)
                }
            } catch (error) {
              // HANDLING ERROR
              console.error(error)
            }
        }

        // FETCHING USER INFO
        const fetchUser = async () => {
            try {
                const response = await fetch('https://traveltales-backend.up.railway.app/user/all-users')
                
                const json = await response.json()
                if (!response.ok) {
                    console.error(json.error)
                } else {
                    setUsers(json)
                }
            } catch (err) {
                console.error(err)
            }
        }

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

        getPosts()
        fetchUser()
        fetchCountries()

    }, [])

    // RETURNING VIEW -----------------------------------------------------------------------------
    return (
        <div className='welcome-box'>
            <img src="TravelTalesLogo.png" alt="TravelTales"></img>
            <h1>Welcome to <span>TravelTales</span></h1>
            <p>Welcome to <b>TravelTales</b>, a vibrant community-driven platform where wanderlust meets storytelling. Our
            platform seamlessly integrates real-time country data with personal travel experiences, creating a
            unique space for travellers to share their adventures and connect with fellow explorers worldwide.</p>
            <Link to='posts' className='redirect-to-posts'>Explore the World!</Link>
            <div className='popular-posts'>
                <h2>Popular posts</h2>
                {posts &&
                posts.map((post, i) => {
                    var hasLiked = false
                    var hasDisliked = false
                    var title = ['Most Liked Post', 'Latest Post', 'Most Comments on Post']
                    return (
                    <div className='post-page2'>
                        <h3>{title[i]}</h3>
                    <div className='post-card'>
                    <div className='post-user'>
                        <i className='fas fa-user'></i>
                        <div className='post-user-info'>
                            {users && users.map((user) => {
                                if (user.id.toString() === post.poster) {
                                    username = user.username
                                }
                            })}
                            <div>
                                <h4><Link to={`/profile/#${post._id}`}>{username || 'Anonymous'}</Link></h4>
                            </div>      
                            {countries && countries.map((country) => {
                                const curr = Object.values(country.currencies)
                                if (country.name.common.toLowerCase() === post.country.toLowerCase()) {
                                    return (
                                        <p>{country.flag}&nbsp;{country.name.common} - {country.capital[0]} - {curr.map((singleCurr) => singleCurr.name)}</p>
                                    )
                                }
                            })}
                        </div>
                    </div>
                    <div className='post-content'>
                        <h4>{post.title}</h4>
                        <p>{post.content}</p>
                        <p className='post-date'>Visited on: {new Date(post.date).toDateString()}</p>
                        <p className='post-date'>Posted on: {new Date(post.createdAt).toDateString()}</p>
                    </div>
                    <div className='post-action'>
                        <p>{post.likes.length}&nbsp;
                            <button>
                                {post.likes.length !== 0
                                    ? post.likes.map((like) => {
                                        if (users && like.toString() === users.id) {
                                            hasLiked = true                                                            
                                        }                                                           
                                        })
                                    :  hasLiked = false
                                }
                                {hasLiked === true
                                    ? <i class="fas fa-thumbs-up"></i>
                                    : <i class="fa-regular fa-thumbs-up"></i>
                                }
                            </button>
                        </p>
                        <p>{post.dislikes.length}&nbsp;
                            <button>
                                {post.dislikes.length !== 0
                                    ? post.dislikes.map((dislike) => {
                                        if (users && dislike.toString() === users.id) {
                                            hasDisliked = true                                                            
                                        }                                                           
                                        })
                                    :  hasDisliked = false
                                }
                                {hasDisliked === true
                                    ? <i class="fas fa-thumbs-down"></i>
                                    : <i class="fa-regular fa-thumbs-down"></i>
                                }
                            </button>
                        </p>
                        <p>{post.comments.length}&nbsp;
                            <button>
                                <i class="fa-regular fa-comment"></i>
                            </button>
                        </p>
                    </div>
                    <h4 className='more'><Link to={`/posts/#${post._id}`}>More</Link></h4>
                </div>
                </div>
                )})
                }   
            </div>
        </div>
    )
}

export default Home

// END OF DOCUMENT --------------------------------------------------------------------------------