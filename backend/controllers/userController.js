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

        const allUsers= []
        users.map((user) => {
            const singleUser = {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                following: user.following,
                followers: user.followers
            }

            allUsers.push(singleUser)
        })

        // RETURNING USERS
        return res.status(200).json(allUsers)

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
            return res.status(404).json({ error: "Cannot find user in database." })
        }

        const userInfo = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            following: user.following,
            followers: user.followers
        }

        // RETURNING USER IF STATUS OK
        return res.status(200).json(userInfo)

    } catch (err) {
        // RETURNING ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ error: "Something went wrong." })
    }
}

const followUser = async (req, res) => {
    const {loggedInUserEmail, selectedUserID} = req.body
    
    if (!loggedInUserEmail) {
        return res.status(401).json({ error: "User email cannot be empty." })
    }

    if (!selectedUserID) {
        return res.status(404).json({ error: "Invalid selected user ID." })
    }
    try {
        const loggedInUser = await userModel.findOne({ email: loggedInUserEmail })
        
        if (!loggedInUser) {
            return res.status(404).json({ error: "You need to log in to use this functionality." })
        }

        const selectedUser = await userModel.findById({ _id: selectedUserID })
        
        if (!selectedUser) {
            return res.status(404).json({ error: "Could not find selected user." })
        }
    
        if (selectedUser._id.toString() === loggedInUser._id.toString()) {
            return res.status(400).json({ error: "You cannot follow your own profile" })
        }

        var alreadyFollowing;
        selectedUser.followers.map((follower) => {
            if (follower.toString() === loggedInUser._id.toString()) {
                alreadyFollowing = follower.toString()
            }
        })

        if (alreadyFollowing) {
            await userModel.updateOne(
                {_id: selectedUserID},
                {$pull: { "followers": {$in: [alreadyFollowing]} }}
            )
            await userModel.updateOne(
                {_id: loggedInUser._id},
                {$pull: { "following": {$in: [selectedUser]} }}
            )
            return res.status(200).json({ message: "User has been unfollowed." })
        }
        
        const updateSelectedUser = await userModel.findByIdAndUpdate(
            {_id: selectedUserID},
            { $addToSet: { followers: loggedInUser } },
            { new: true }
        )

        if (!updateSelectedUser) {
            return res.status(400).json({ message: "Couldn't add the user as a follower."})
        }

        const updateLoggedInUser = await userModel.findOneAndUpdate(
            {email: loggedInUserEmail},
            { $addToSet: { following: selectedUser } },
            { new: true }
        )

        if (!updateLoggedInUser) {
            return res.status(400).json({ message: "Couldn't follow user."})
        }

        // RETURNING KEY IN RESPONSE
        return res.status(201).json({message: `You are now following ${selectedUser.username}` })
        
    } catch (err) {
        // RETURNING ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ error: "Something went wrong." + err })
    }
}

module.exports = {
    getAllUsers,
    getSingleUser,
    followUser
}

// END OF DOCUMENT --------------------------------------------------------------------------------