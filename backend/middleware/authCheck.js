// NOTE: IMPORTS ----------------------------------------------------------------------------------
const jwt = require('jsonwebtoken')

// AUTH CHECK FUNCTION
const authCheck = async (req, res, next) => {
    try {
        // GET AUTH HEADER
        const { authorization } = req.headers

        //  SPLIT TOKEN FROM 'Bearer'
        const token = authorization.split(' ')[1]

        // VERIFYING TOKEN AND DECODING IT
        if (token) {
            jwt.verify(token, process.env.SECRET)
            next()
        } else {
            return res.status(401).json({ message: 'Request is not authorized' })
        }

    } catch (error) {
        // SENDING BACK AN ERROR IF COULDN'T CREATE
        return res.status(401).json({ message: 'Request is not authorized' })
    }
}

module.exports = authCheck

// END OF DOCUMENT --------------------------------------------------------------------------------