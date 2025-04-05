// NOTE: IMPORTS ----------------------------------------------------------------------------------
const express = require('express')
const { 
    userLogin,
    userRegister,
    userLogout
} = require('../controllers/authController')

// NOTE: CREATING ROUTER
const router = express.Router()

// NOTE: LOGIN ROUTE
router.post('/login', userLogin)

// NOTE: REGISTER ROUTE
router.post('/register', userRegister)

module.exports = router
// END OF DOCUMENT --------------------------------------------------------------------------------