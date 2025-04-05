// NOTE: IMPORTS ----------------------------------------------------------------------------------
const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// NOTE: VARIABLES
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // EMAIL FORMAT xxxx@xxxx.xxxx

// TOKEN GENERATION
const createToken = (_id) => {
    return jwt.sign({ id: _id }, process.env.SECRET,{ expiresIn: '1d' })
}

// /auth/login
// NOTE: LOGIN FUNCTION ---------------------------------------------------------------------------
const userLogin = async (req, res) => {
    const { email, password } = req.body;

    // CHECKING IF FIELD HAS BEEN LEFT EMPTY
    if (email === '' || password === '') {
        return res.status(400).json({ message: "Field cannot be empty." })
    }
    // CHECKING EMAIL FORMAT
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Email address is not valid." })
    }

    try {
        // RETRIEVE USER FROM DB
        const user = await userModel.findOne({ email })

        // CHECKING IF USER IS IN DB
        if (!user) {
            return res.status(400).json({ message: "No such user is registered." })
        }

        // RETRIEVE USER PASSWORD
        const match = await bcrypt.compare(password, user.password)

        // CHECKING IF USER ENTERED PASSWORD MATCHES THE ON IN THE DB
        if (!match) {
            return res.status(401).json({ message: "Invalid credentials"})
        }

        // CREATING TOKEN
        const token = createToken(user._id)

        // RESPONSE IF THE LOGIN WAS SUCCESSFUL
        return res.status(200).json({ 
            message: "Logged in successfully.",
            user: {
                id: user._id,
                email: user.email,
                token: token 
            }
        })

    } catch (err) {
        // CHECKING FOR ERRORS
        return res.status(500).json({ message: "Something went wrong." + err})
    }
}

// /auth/register
// NOTE: REGISTER FUNCTION ------------------------------------------------------------------------
const userRegister = async (req, res) => {
    const {username, email, password, confirmPassword } = req.body;

    // VALIDATING IF FIELDS ARE EMPTY
    if (username === '' || email ==='' || password === '' || confirmPassword === '') {
        return res.status(400).json({ message: "Field cannot be empty." })
    }

    // CHECKING IF THE PASSWORDS MATCH
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "The passwords do not match!" })
    }

    // TESTING EMAIL FORMAT
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Email address is not valid." })
    }

    // CHECKING IF USER IS ALREADY IN DB
    const userExists = await userModel.findOne({ email })
    if (userExists) {
        return res.status(400).json({ message: "This email address is already registered." })
    }
    
    // CREATING BASE ROLE
    const role = 'user'

    try {
        // GENERATING SALT
        const salt = await bcrypt.genSalt(10)
        // HASHING PASSWORD
        const hashedPassword = await bcrypt.hash(password, salt)

        // ATTEMPTING TO CREATE USER
        const user = await userModel.create({
            username,
            email,
            password: hashedPassword,
            role
        })

        // CHECKING IF THE CREATION WAS SUCCESSFUL
        if (!user) {
            return res.status(400).json({message: "User could not be created."})
        }

        // CREATING TOKEN
        const token = createToken(user._id)

        // RESPONSE IF REGISTERING IS SUCCESSFUL
        return res.status(201).json({
            message: "Registered successfully.",
            user: {
                id: user._id,
                email: user.email,
                token: token 
            }
        })

    } catch (err) {
        // CHECKING FOR ERRORS
        const error = new Error("Something went wrong.")
        error.status = 500
        return error
    }
}

module.exports = {
    userLogin,
    userRegister
}
// END OF DOCUMENT --------------------------------------------------------------------------------