// IMPORTS ----------------------------------------------------------------------------------------
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import UpdatePost from '../components/UpdatePost';
import Logout from '../components/Logout';
import { usePostContext } from '../hooks/usePostContext';

// OTHER PROFILE ----------------------------------------------------------------------------------
const UserProfile = () => {
    // VARIABLES, LOCAL STORAGE INFO AND STATE VARIABLES
    const {posts, dispatch} = usePostContext()
    const [singleUser, setSingleUser] = useState(null)
    const [users, setUsers] = useState(null)
    const [updatePopUp, setUpdatePopUp] = useState(false)
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)
    const [countries, setCountries] = useState(null)
    const [selectedID, setSelectedID] = useState(null)
    const loggedInUserID = localStorage.getItem('id');
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token')
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
                const response = await fetch('https://traveltales-backend.up.railway.app/user/single-user',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: loggedInUserID })
                })
                
                const json = await response.json()
                if (!response.ok) {
                    console.error(json.error)
                } else {
                    setSingleUser(json)
                }
            } catch (err) {
                console.error(err)
            }
        }

        // FETCHING USER'S POSTS
        const fetchUsersPosts = async () => {
            try {
                const response = await fetch('https://traveltales-backend.up.railway.app/post/get-users-posts',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userID: loggedInUserID })
                })
                const json = await response.json()

                if (!response.ok) {
                    setError(json.error)
                    setTimeout(() => {
                        setError(null)
                    }, 4000)
                } else {
                    dispatch({type: 'SET_POSTS', payload: json})
                }
            } catch (err) {
                console.error(err)
            }
        }

        // FETCHING ALL USERS
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://traveltales-backend.up.railway.app/user/all-users')
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

    // HANDLE UPDATE POP UP -----------------------------------------------------------------------
    const handleUpdate = async (e, id) => {
        e.preventDefault()
        setSelectedID(id)
        setUpdatePopUp(!updatePopUp)
    }

    // HANDLE DELETE ------------------------------------------------------------------------------
    const handleDelete = async (e, postID) => {
        e.preventDefault()
        try {
            if (singleUser) {
                const response = await fetch('https://traveltales-backend.up.railway.app/post/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ selectedPostID: postID, userEmail: email })
                })
                const json = await response.json()
                // CHECKING RESPONSE
                if (!response.ok) {
                    setError(json.error)
                    setTimeout(() => {
                        setError(null)
                    }, 4000)
                } else {
                    dispatch({type: 'DELETE_POST', payload: postID})
                    setMessage(json.message)
                    setTimeout(() => {
                        setMessage(null)
                    }, 4000)
                }
            } else {
                setError("You need to log in to delete the post!")
                setTimeout(() => {
                    setError(null)
                }, 4000)
            }
        } catch (err) {
            // SENDING ERROR RESPONSE
            console.error(err)
        }
    }
    // RETURNING VIEW -----------------------------------------------------------------------------
    return (
        <div className='others-profile'>
            <div className='followers-container'>
                <h2>{singleUser && singleUser.username}'s Followers List</h2>
                {singleUser &&
                    singleUser.followers.map((follower) => (
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
                {singleUser && 
                    <div className='following-box'>
                        <i className='fas fa-user'></i>
                        <h2>{singleUser.username}</h2>
                        <div className='follow-info'>
                            <p>Followers {singleUser.followers.length}</p>                    
                            <p>Following {singleUser.following.length}</p>
                        </div>
                        <Logout />
                    </div>
                }
                <h2>Your posts</h2>
                {singleUser && posts &&
                posts.map((post) => {
                    var hasLiked = false
                    var hasDisliked = false
                    return (
                    <div className='post-page2'>
                    <div className='post-card'>
                    <div className='post-user'>
                        <i className='fas fa-user'></i>
                        <div className='post-user-info'>
                            <div>
                                <h4><Link to={`/posts/#${post._id}`}>{singleUser.username || 'Anonymous'}</Link></h4>
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
                        {loggedInUserID && post.poster == loggedInUserID &&
                            <div className='post-owner-actions'>
                                <button className='btn button-update' onClick={(e) => handleUpdate(e, post._id)}>
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button className='btn button-delete' onClick={(e) => handleDelete(e, post._id)}>
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div> 
                        } 
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
                                                                if (singleUser && like.toString() === singleUser.id.toString()) {
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
                                                                if (singleUser && dislike.toString() === singleUser.id.toString()) {
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
                </div>
                </div>
                )})
                }
                {singleUser && !posts &&
                    <p>You have no posts yet!</p>
                }
            </div>
            {!singleUser && 
                <p>Cannot load profile</p>
            }
            {message &&
                <p className='pop-up-message'>{message}</p>
            }
            {error &&
                <p className='pop-up-error'>{error}</p>
            }
            {updatePopUp &&
                <div className='update-form'>
                    <button className='button-close' onClick={handleUpdate}>X</button>
                    <UpdatePost selectedID={selectedID}/>
                </div>
            }
            <div className='following-container'>
                <h2>{singleUser && singleUser.username}'s Following List</h2>
                {singleUser &&
                    singleUser.following.map((follower) => (
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

export default UserProfile

// END OF DOCUMENT --------------------------------------------------------------------------------