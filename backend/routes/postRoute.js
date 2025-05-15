// NOTE: IMPORTS ----------------------------------------------------------------------------------
const express = require('express')
const { 
    getAllPosts,
    getSinglePost,
    createPost,
    addLike,
    addDislike,
    deletePost,
    updatePost,
    addComment,
    getUserSpecificPosts,
    getFollowingPosts,
    trendingPosts
} = require('../controllers/postController')
const authCheck = require('../middleware/authCheck')

// NOTE: CREATING ROUTER
const router = express.Router()

// NOTE: GET ALL POST ROUTE
router.get('/all-posts', getAllPosts)

// NOTE: GET SINGLE POST ROUTE
router.post('/single-post', getSinglePost)

// NOTE: GET USERS POSTS
router.post('/get-users-posts', getUserSpecificPosts)

// NOTE: GET FOLLOWING POSTS
router.post('/get-following-posts', getFollowingPosts)

// NOTE: GET POPULAR POSTS
router.get('/get-popular-posts', trendingPosts)

router.use(authCheck)

// NOTE: CREATE POST
router.post('/new-post', createPost)

// NOTE: ADD LIKE
router.post('/add-like/:id', addLike)

// NOTE: ADD LIKE
router.post('/add-dislike/:id', addDislike)

// NOTE: DELETING POST
router.delete('/delete', deletePost)

// NOTE: UPDATE POST
router.post('/update', updatePost)

// NOTE: ADDING COMMENT
router.post('/add-comment', addComment)

module.exports = router
// END OF DOCUMENT --------------------------------------------------------------------------------