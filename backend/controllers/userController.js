// NOTE: IMPORTS
const userModel = require("../models/userModel")

// NOTE: GET ALL USERS ----------------------------------------------------------------------------
const getAllUsers = async (req, res) => {
    try {
        // FETHCING ALL USERS
        const users = await userModel.find({})

        // CHECKING IF THE USERS HAVE BEEN FOUND
        if (!users) {
            return res.status(404).json({ message: "Cannot get users." })
        }

        // RETURNING USERS
        return res.status(200).json(users)

    } catch (err) {
        // RETURNING ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ message: "Something went wrong." })
    }
}

// NOTE: GET SINGLE USER --------------------------------------------------------------------------
const getSingleUser = async (req, res) => {
    // TAKING IN EMAIL FROM BODY
    const id = req.body

    const uID = id.id
    try {
        // USING EMAIL TO FIND USER
        const user = await userModel.findById({ _id: uID })

        // IF USER DOESNT EXISTS SENDING MESSAGE
        if (!user) {
            return res.status(404).json({ message: "Cannot find user in database." })
        }

        const userInfo = {
            username: user.username,
            email: user.email,
            apikeys: user.apikeys,
            role: user.role
        }

        // RETURNING USER IF STATUS OK
        return res.status(200).json(userInfo)

    } catch (err) {
        // RETURNING ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ message: "Something went wrong." })
    }
}

module.exports = {
    getAllUsers,
    getSingleUser
}

// END OF DOCUMENT --------------------------------------------------------------------------------