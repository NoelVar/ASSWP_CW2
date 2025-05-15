// IMPORTS ----------------------------------------------------------------------------------------
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CreatePost from '../components/CreatePost';
import UpdatePost from '../components/UpdatePost';
import { usePostContext } from "../hooks/usePostContext"

// GENERAL FEED -----------------------------------------------------------------------------------
const Posts = () => {

    // VARIABLES & STATE VARIABLES, LOCAL STORAGE INFO
    const {posts, dispatch} = usePostContext()
    const [originalPosts, setOriginalPosts] = useState(null)
    const [singleUser, setSingleUser] = useState(null)
    const [userFilter, setUserFilter] = useState('')
    const [countries, setCountries] = useState(null)
    const [users, setUsers] = useState(null)
    const [selectedID, setSelectedID] = useState(null)
    const [comment, setComment] = useState(null)
    const [updatePopUp, setUpdatePopUp] = useState(false)
    const [message, setMessage] = useState(null)
    const [commentToggle, setCommentToggle] = useState(null)
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage] = useState(3)
    const user = localStorage.getItem('user');
    const userID = localStorage.getItem('id');
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token')
    const params = window.location.href
    const id = params.split('/#').reverse()[0]
    var username = 'Anonymous'
    var following = 0
    var followers = 0

    // USEEFFECT TO FETCH DATA ON LOAD
    useEffect(() => {
        // FETCHING POST FROM USERS THAT ARE FOLLOWED
        const getPosts = async () => {
            try {
                const response = await fetch('http://localhost:7000/post/all-posts')
        
                // CHECKING RESPONSE
                if (response.ok) {
                    const data = await response.json()
                    dispatch({type: 'SET_POSTS', payload: data})
                    setOriginalPosts(data)
                    const elementExists = document.getElementById(id)
                    if (elementExists) {
                        elementExists.scrollIntoView();
                    }
                }
            } catch (error) {
              // HANDLING ERROR
              console.error(error)
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

        // FETCHING USERS
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

        // FETCHING LOGGED IN USER INFORMATION
        const fetchLoggedInUser = async () => {
            try {
                const response = await fetch('http://localhost:7000/user/single-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: userID })
                })
                const json = await response.json()

                if (!response.ok) {
                    console.log(response)
                } else {
                    setSingleUser(json)
                }

            } catch (err) {
                // SENDING ERROR RESPONSE
                console.error(err)
            }
        }

        getPosts()
        fetchCountries()
        fetchUsers()
        fetchLoggedInUser()

    }, [])

    // HANDLING LIKE ------------------------------------------------------------------------------
    const handleLike = async (e, id) => {
        e.preventDefault()
        if (user) {
            try {
                const response = await fetch('http://localhost:7000/post/add-like/' + id, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ email })
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
            setError("You need to log in to like the post!")
            setTimeout(() => {
                setError(null)
            }, 4000)
        }
    }

    // HANDLING DISLIKE ---------------------------------------------------------------------------
    const handleDislike = async (e, id) => {
        e.preventDefault()
        if (user) {
            try {
                const response = await fetch('http://localhost:7000/post/add-dislike/' + id, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ email })
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
            setError("You need to log in to dislike the post!")
            setTimeout(() => {
                setError(null)
            }, 4000)
        }
    }

    // UPDATE POP UP ------------------------------------------------------------------------------
    const handleUpdate = async (e, id) => {
        e.preventDefault()
        setSelectedID(id)
        setUpdatePopUp(!updatePopUp)
    }

    // HANDLING DELETE ----------------------------------------------------------------------------
    const handleDelete = async (e, postID) => {
        e.preventDefault()
        try {
            if (user) {
                const response = await fetch('http://localhost:7000/post/delete', {
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

    // HANDLING COMMENT TOGGLE --------------------------------------------------------------------
    const handleComment = async (e, id) => {
        e.preventDefault()
        if (commentToggle !== id) {
            setCommentToggle(id)
        } else {
            setCommentToggle(null)
        }
        
    }

    // ADDING COMMENT -----------------------------------------------------------------------------
    const submitComment = async (e, postID) => {
        e.preventDefault()
        try {
            if (user) {
                const response = await fetch('http://localhost:7000/post/add-comment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ poster: email, content: comment, postID: postID})
                })
                const json = await response.json()
                // CHECKING RESPONSE
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
            } else {
                setError("You need to log in to comment under a post!")
                setTimeout(() => {
                    setError(null)
                }, 4000)
            }
        } catch (err) {
            // SENDING ERROR RESPONSE
            console.error(err)
        }
    }

    // USERNAME FILTER ----------------------------------------------------------------------------
    const handleUserFilter = (e) => {
        e.preventDefault()
        users.map((user) => {
            if (e.target.value.toLowerCase() === user.username.toLowerCase()) {
                setUserFilter(user.id)
            }
        })
    }

    // HANDLING ALL FILTERS -----------------------------------------------------------------------
    const handleFilter = (e) => {
        e.preventDefault()
        const filteredPosts = originalPosts.filter((post) => {         
            return (
                (!selectedCountry ||
                    post.country.toLowerCase() === selectedCountry.toLowerCase()) &&
                (!userFilter ||
                    post.poster.toString() === userFilter.toString())
            )
        })
        dispatch({type: 'SET_POSTS', payload: filteredPosts})
        setCurrentPage(1)
    }

    // HANDLING CLEARING FILTERS ------------------------------------------------------------------
    const handleClear = (e) => {
        setSelectedCountry('')
        setUserFilter('')
        dispatch({type: 'SET_POSTS', payload: originalPosts})
        setCurrentPage(1)
    }

    // HANDLING SORTING BY LIKES ------------------------------------------------------------------
    const handleMostLiked = (e) => {
        e.preventDefault()
        if (posts) {
            const mostLiked = [...posts].sort((a, b) => (a.likes.length < b.likes.length) ? 1 : -1)
            dispatch({type: 'SET_POSTS', payload: mostLiked})
            setCurrentPage(1)
        }
    }

    // HANDLING SORTING BY COMMENTS ---------------------------------------------------------------
    const handleMostComments = (e) => {
        e.preventDefault()
        if (posts) {
            const mostCommented = [...posts].sort((a, b) => (a.comments.length < b.comments.length) ? 1 : -1)
            dispatch({type: 'SET_POSTS', payload: mostCommented})
            setCurrentPage(1)
        }
    }

    // PAGINATION HANDLERS ------------------------------------------------------------------------
    // GET CURRENT POSTS
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = posts ? posts.slice(indexOfFirstPost, indexOfLastPost) : []
    
    // CHANGE PAGE
    const paginate = (pageNumber) => setCurrentPage(pageNumber)
    
    // GO TO NEXT PAGE
    const nextPage = () => {
        if (posts && currentPage < Math.ceil(posts.length / postsPerPage)) {
            setCurrentPage(currentPage + 1)
        }
    }
    
    // GO TO PREVIOUS PAGE
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    // RETURNING VIEW -----------------------------------------------------------------------------
    return (
        <div className='outer-wrapper'>
            <div className='filters'>
                <h2>Filter the posts</h2>
                <form onSubmit={handleFilter}>
                    <div className='single-filter'>
                        <label>Search by user</label>
                        <input
                            type='text'
                            placeholder='Seach by username...'
                            onChange={handleUserFilter}
                        />
                    </div>
                    <div className='single-filter'>
                        <label>Search by country</label>
                        <select required onChange={e => setSelectedCountry(e.target.value)}>
                            <option selected hidden>Select a country</option>
                            {countries && countries.map((country) => (
                                <option value={country.name.common}>{country.flag}&nbsp;{country.name.common}</option>
                            ))}
                        </select>
                    </div>
                    <div className='single-filter'>
                        <button type='submit'>Filter</button>
                        <input type='reset' onClick={handleClear}/>
                    </div>
                    <div className='single-filter'>
                        <h3>Sort posts by</h3>
                        <button onClick={handleClear}>Latest</button>
                        <button onClick={handleMostLiked}>Most Liked</button>
                        <button onClick={handleMostComments}>Most Comments</button>
                    </div>
                    <div className='single-filter'>
                        <h3>Feeds</h3>
                        <Link to='/posts' className='active'>General Feed</Link>
                        <Link to='/following-feed'>Following Feed</Link>
                    </div>
                </form>
            </div>
            <div className='post-page'>
                <h1 className='title'>General Feed</h1>
                <CreatePost />
                {currentPosts && currentPosts.map((post) => { 
                var hasLiked = false
                var hasDisliked = false
                return (
                    <div className='post-card' id={post._id}>
                        <div className='post-user'>
                            <i className='fas fa-user'></i>
                            <div className='post-user-info'>
                                {users && users.map((user) => {
                                    if (user.id.toString() === post.poster) {
                                        username = user.username
                                        following = user.following.length
                                        followers = user.followers.length
                                    }
                                })}
                                <div>
                                    <h4><Link to={`/profile/${post.poster}`}>{username || 'Anonymous'}</Link></h4>
                                    <div className='post-user-follow'>
                                        <p>{followers} follower</p>
                                        <p>{following} following</p>
                                    </div>
                                </div>      
                                {countries && countries.map((country) => {
                                    const curr = Object.values(country.currencies)
                                    if (post.country && country.name.common.toLowerCase() === post.country.toLowerCase()) {
                                        return (
                                            <p>{country.flag}&nbsp;{country.name.common} - {country.capital[0]} - {curr.map((singleCurr) => singleCurr.name)}</p>
                                        )
                                    }
                                })}
                            </div>
                            {userID && post.poster == userID &&
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
                            <p>{post.likes.length}&nbsp;<button onClick={e => handleLike(e, post._id)}>
                                                            {post.likes && post.likes.length !== 0
                                                                ? post.likes.map((like) => {
                                                                    if (userID && like.toString() === userID.toString()) {
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
                            <p>{post.dislikes.length}&nbsp;<button onClick={e => handleDislike(e, post._id)}>
                                                            {post.dislikes.length !== 0
                                                                ? post.dislikes.map((dislike) => {
                                                                    if (userID && dislike.toString() === userID.toString()) {
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
                                <button onClick={e => handleComment(e, post._id)}>
                                    <i class="fa-regular fa-comment"></i>
                                </button>
                            </p>
                        </div>
                        {commentToggle && commentToggle === post._id &&
                            <div>
                                {user &&
                                    <div className='comment-input'>
                                        <input
                                            type='text'
                                            placeholder='Add a comment...'
                                            value={comment}
                                            onChange={e => setComment(e.target.value)}
                                        />
                                        <button className='btn' onClick={e => submitComment(e, post._id)}>Submit</button>
                                    </div>
                                }
                                <div className='all-comments'>
                                {post.comments.map((comment) => (
                                    <div className='single-comment'>
                                        {users && users.map((user) => {
                                            if (user.id.toString() == comment.poster.toString()) {
                                                return(<h4><Link to={`/profile/${post.poster}`}>{user.username || 'Anonymous'}</Link></h4>)
                                            }
                                        })}
                                        <p>{comment.content}</p>
                                    </div>
                                ))}
                                </div>
                            </div>
                        }
                    </div>
                )})}
                {posts && posts.length > 0 && (
                    <div className='pagination'>
                        <button 
                            onClick={prevPage} 
                            disabled={currentPage === 1}
                            className={currentPage === 1 ? 'pagination-disabled' : ''}
                        >
                            Previous
                        </button>
                        {Array.from({ length: Math.ceil(posts.length / postsPerPage) }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => paginate(index + 1)}
                                className={currentPage === index + 1 ? 'pagination-active' : ''}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button 
                            onClick={nextPage} 
                            disabled={currentPage === Math.ceil(posts.length / postsPerPage)}
                            className={currentPage === Math.ceil(posts.length / postsPerPage) ? 'pagination-disabled' : ''}
                        >
                            Next
                        </button>
                    </div>
                )}
                
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
            </div>
            <div className='profile'>
                <h2>Profile</h2>
                {singleUser && 
                    <div className='profile-info'>
                        <i className='fas fa-user'></i>
                        <h3>{singleUser.username}</h3>
                        <div className='follow-info'>
                            <p>Followers {singleUser.followers.length}</p>                            
                            <p>Following {singleUser.following.length}</p>
                        </div>
                        <Link to='/my-profile'>Go to Profile</Link>
                    </div>
                }
                {!singleUser && 
                    <div className='profile-info'>
                        <h3>Please log in</h3>
                        <Link to='/login'>Login here</Link>
                    </div>
                }
            </div>
        </div>
    )
}

export default Posts

// END OF DOCUMENT --------------------------------------------------------------------------------