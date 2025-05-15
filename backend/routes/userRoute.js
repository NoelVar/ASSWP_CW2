// NOTE: IMPORTS ----------------------------------------------------------------------------------
const express = require('express')
const { 
    getAllUsers,
    getSingleUser,
    followUser
} = require('../controllers/userController')

// NOTE: CREATING ROUTER
const router = express.Router()

// NOTE: GET ALL USERS ROUTE
router.get('/all-users', getAllUsers)

// NOTE: GET SINGLE USER ROUTE
router.post('/single-user', getSingleUser)

// NOTE: FOLLOW USER
router.post('/follow', followUser)

module.exports = router
// END OF DOCUMENT --------------------------------------------------------------------------------