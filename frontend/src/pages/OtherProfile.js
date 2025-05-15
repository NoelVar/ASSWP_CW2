// IMPORTS ----------------------------------------------------------------------------------------
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// OTHER PROFILE ----------------------------------------------------------------------------------
const OtherProfile = () => {
    // VARIABLES, LOCAL STORAGE INFO AND STATE VARIABLES
    const params = window.location.href
    const id = params.split('/').reverse()[0]
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)
    const [posts, setPosts] = useState(null)
    const [countries, setCountries] = useState(null)
    const [users, setUsers] = useState(null)
    const loggedInUser = localStorage.getItem('email');
    const loggedInUserID = localStorage.getItem('id');
    const token = localStorage.getItem('token')
    var isFollowing = false
    var otherUser = 'Anonymous'

    // USEEFFECT TO RETRIEVE DATA ON LOAD
    useEffect(() => {
        // FETCHING COUNTRY INFO
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

        // FETCHING SINGLE USER INFO
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:7000/user/single-user',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id })
                })
                
                const json = await response.json()
                if (!response.ok) {
                    console.error(json.error)
                } else {
                    setUser(json)
                }
            } catch (err) {
                console.error(err)
            }
        }

        // FETCHING USER'S POSTS
        const fetchUsersPosts = async () => {
            try {
                const response = await fetch('http://localhost:7000/post/get-users-posts',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userID: id })
                })
                const json = await response.json()

                if (!response.ok) {
                    setError(json.error)
                    setTimeout(() => {
                        setError(null)
                    }, 4000)
                } else {
                    setPosts(json)
                }
            } catch (err) {
                console.error(err)
            }
        }

        // FETCHING ALL USERS
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:7000/user/all-users')
                const json = await response.json()

                if (!response.ok) {
                    console.log(response)
                } else {
                    setUsers(json)
                }

            } catch (err) {
                // SENDING ERROR RESPONSE
                console.error(err)
            }
        }

        fetchCountries()
        fetchUser()
        fetchUsersPosts()
        fetchUsers()
    }, [])

    // HANDLING FOLLOW AND UNFOLLOW ---------------------------------------------------------------
    const handleFollow = async (e) => {
        e.preventDefault()
        if (loggedInUser) {
            try {
                const response = await fetch('http://localhost:7000/user/follow', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        loggedInUserEmail: loggedInUser,
                        selectedUserID: user.id,
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
                    }, 4000)
                }
    
            } catch (err) {
                // SENDING ERROR RESPONSE
                console.error(err)
            }
        } else {
            setError("You need to log in to follow others!")
            setTimeout(() => {
                setError(null)
            }, 4000)
        }
    }

    // RETURNING VIEW -----------------------------------------------------------------------------
    return (
        <div className='others-profile'>
            <div className='followers-container'>
                <h2>{user && user.username}'s Followers List</h2>
                {user &&
                    user.followers.map((follower) => (
                        <div>
                        {users && users.map((user) => {
                            if (user.id.toString() === follower.toString()) {
                                otherUser = user.username
                            }
                        })}
                        <h4><i className='fas fa-user'></i><Link to={`/profile/${follower}`} onClick={window.location.reload}>{otherUser || 'Anonymous'}</Link></h4>
                        </div>
                    ))
                }
            </div>
            <div className='other-container'>
                {user &&
                    <div className='following-box'>
                        <i className='fas fa-user'></i>
                        <h2>{user.username}</h2>
                        <div className='follow-info'>
                            <p>Followers {user.followers.length}</p>                    
                            <p>Following {user.following.length}</p>
                        </div>
                        <button onClick={handleFollow}>
                            {user.followers.length !== 0
                                ? user.followers.map((follower) => {
                                    if (loggedInUserID && follower.toString() === loggedInUserID.toString()) {
                                        isFollowing = true                                                            
                                    }                                                           
                                    })
                                :  isFollowing = false
                            }
                            {isFollowing === true
                                ? <p className='unfollow'>Unfollow</p>
                                : <p className='follow'>Follow</p>
                            }
                        </button>
                    </div>
                }
                <h2>{user && user.username}'s posts</h2>
                {user && posts &&
                posts.map((post) => {
                    var hasLiked = false
                    var hasDisliked = false
                    return (
                    <div className='post-page2'>
                    <div className='post-card2'>
                    <div className='post-user'>
                        <i className='fas fa-user'></i>
                        <div className='post-user-info'>
                            <div>
                                <h4><Link to={`/profile/${post._id}`}>{user.username || 'Anonymous'}</Link></h4>
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
                        <p>{post.likes.length}&nbsp;<button>
                                                        {post.likes.length !== 0
                                                            ? post.likes.map((like) => {
                                                                if (user && like.toString() === user.id.toString()) {
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
                        <p>{post.dislikes.length}&nbsp;<button>
                                                        {post.dislikes.length !== 0
                                                            ? post.dislikes.map((dislike) => {
                                                                if (user && dislike.toString() === user.id.toString()) {
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
                {!user && 
                    <p>Cannot load profile</p>
                }
                {message &&
                    <p className='pop-up-message'>{message}</p>
                }
                {error &&
                    <p className='pop-up-error'>{error}</p>
                }
            </div>
            <div className='following-container'>
                <h2>{user && user.username}'s Following List</h2>
                {user &&
                    user.following.map((follower) => (
                        <div>
                        {users && users.map((user) => {
                            if (user.id.toString() === follower.toString()) {
                                otherUser = user.username
                            }
                        })}
                        <h4><i className='fas fa-user'></i><Link to={`/profile/${follower}`} onClick={window.location.reload}>{otherUser || 'Anonymous'}</Link></h4>
                        </div>
                    ))
                }
            </div>
        </div>
    )
    }

export default OtherProfile

// END OF DOCUMENT --------------------------------------------------------------------------------