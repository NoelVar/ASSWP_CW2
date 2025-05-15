const { default: mongoose } = require("mongoose")
const postModel = require("../models/postModel")
const userModel = require("../models/userModel")

// GET ALL POSTS ----------------------------------------------------------------------------------
const getAllPosts = async (req, res) => {
    // ATTEMPTING TO RETRIEVE ALL POSTS
    try {
        // STORING ALL POSTS IN "allPosts" SORTED BY THEIR CREATION DATE
        const allPosts = await postModel.find({}).sort({ createdAt: -1 })

        // CHECKING IF 'allPosts' IS EMPTY
        if (!allPosts) {
            return res.status(400).json({ error: "Couln't get posts." })
        }   

        // RETURNING ALL POSTS
        return res.status(200).json(allPosts)
    } catch (err) {
        // CATCHING SERVER ERROR
        return res.status(500).json({ error: "Internal server error." })
    }
}

// GET SINGLE POST --------------------------------------------------------------------------------
const getSinglePost = async (req, res) => {
    // RETRIEVING REQUEST BODY VALUES 
    const { id } = req.body;

    // ATTEMPTING TO FIND SINGLE POST
    try {
        // CHECKING IF ID IS VALID
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid post ID." })
        }

        // IF ID IS VALID RETRIEVING POST
        const post = await postModel.findById(id)

        // CHECKING IF POST WAS RETRIEVED
        if (!post) {
            return res.status(400).json({ error: "Couldn't get post." })
        }

        // SENDING OK RESPONSE WITH THE SINGLE POST
        return res.status(200).json(post)
    } catch (err) {
        return res.status(500).json({ error: "Internal server error." })
    }
}

// CREATE POST ------------------------------------------------------------------------------------
const createPost = async (req, res) => {
    // RETRIEVING REQUEST BODY VALUES 
    const { 
        title,
        content,
        date,
        country,
        poster
    } = req.body;

    // CHECKING IF VALUES ARE NOT EMPTY
    if (!title || !content || !date || !country) {
        return res.status(400).json({ error: "Field cannot be empty." })
    }

    // CHECKING IF THE POSTER IS NOT EMPTY
    if (!poster) {
        return res.status(400).json({ error: "User need to be logged in to create post." })
    }

    // ATTEMPTING TO CREATE A POST
    try {
        // RETRIEVING USER FROM DB BASED ON THEIR EMAIL
        const user = await userModel.findOne({ email: poster })

        // CHECKING IF USER WAS FOUND
        if (!user) {
            return res.status(404).json({ error: "Couldn't find user." })
        }

        // CREATING POST
        const post = await postModel.create({
            title: title,
            content: content,
            date: date,
            country: country,
            poster: user._id
        })

        // CHECKING IF POST WAS CREATED
        if (!post) {
            return res.status(201).json({ error: "Couldn't create post." })
        }

        // SENDING RESPONSE WITH MESSAGE AND THE POST
        return res.status(200).json({ message: "Post has been created.", post: post })

    } catch (err) {
        // SENDING ERROR IF SOMEHTING WENT WRONG
        return res.status(500).json({ error: "Internal server error." })
    }
}

// ADD LIKE POST ----------------------------------------------------------------------------------
const addLike = async (req, res) => {
    // RETRIEVING REQEST BODY'S VALUES
    const { id } = req.params;
    const { email } = req.body;

    // ATTEMPTING TO ADD LIKE
    try {
        // CHECKING IF PROVIDED ID IS VALID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid post ID." })
        }

        // CHECKING IF EMAIL IS PROVIDED
        if (!email) {
            return res.status(400).json({ error: "User need to be logged in to like a post." })
        }

        // ATTEMPTING TO FIND POST BASED ON ID
        const post = await postModel.findById(id)

        // CHECKING IF POST WAS FOUND
        if (!post) {
            return res.status(400).json({ error: "Couldn't get post." })
        }

        // ATTEMPTING TO FIND USER BY EMAIL
        const user = await userModel.findOne({ email })

        // CHECKING IF USER WAS FOUND
        if (!user) {
            return res.status(404).json({ error: "Couldn't find user." })
        }

        // CHECKING IF USER OWNS POST
        if (post.poster.toString() === user._id.toString()) {
            return res.status(400).json({ error: "You cannot like your own post." })
        }

        // CHECKING IF USER HAS ALREADY LIKED THE POST
        var alreadyLiked;
        post.likes.map((like) => {
            if (like.toString() === user._id.toString()) {
                alreadyLiked = like.toString()
            }
        })

        // IF THE USER ALREADY LIKED THE POST, THE LIKE IS REMOVED
        if (alreadyLiked) {
            await postModel.updateOne(
                {_id: id},
                {$pull: { "likes": {$in: [alreadyLiked]} }}
            )
            return res.status(200).json({ message: "Like removed successfully" })
        }
        
        // ADDING LIKE
        const updatedPost = await postModel.findByIdAndUpdate(
            {_id: id},
            { $addToSet: { likes: user } },
            { new: true }
        )

        // CHECKING IF POST HAS BEEN UPDATED
        if (!updatedPost) {
            return res.status(400).json({ message: "Couldn't like post."})
        }

        // CHECKING IF USER DISLIKED POST
        var dislikeToRemove;
        post.dislikes.map((dislike) => {
            if (dislike.toString() === user._id.toString()) {
                dislikeToRemove = dislike.toString()
            }
        })

        // IF USER DISLIKED POST REMOVING DISLIKE
        if (dislikeToRemove) {
            await postModel.updateOne(
                {_id: id},
                {$pull: { "dislikes": {$in: [dislikeToRemove]} }}
            )
        }
        
        // RETURNING RESPONSE
        return res.status(201).json({message: "You have liked a post!", likes: updatedPost })

    } catch (err) {
        // RETURNING SERVER ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ error: "Internal server error." })
    }
}

// ADD DISLIKE POST ----------------------------------------------------------------------------------
const addDislike = async (req, res) => {
    // RETRIEVING REQUEST BODY VALUES
    const { id } = req.params;
    const { email } = req.body;

    // ATTEMPTING TO ADD DISLIKE
    try {
        // CHECKING IF PROVIDED ID IS VALID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid post ID." })
        }

        // CHECKING IF USER IS LOGGED IN
        if (!email) {
            return res.status(400).json({ error: "User need to be logged in to dislike a post." })
        }

        // ATTEMPTING TO RETRIEVE POST
        const post = await postModel.findById(id)

        // CHECKING IF POST HAS BEEN RETRIEVED
        if (!post) {
            return res.status(400).json({ error: "Couldn't get post." })
        }

        // ATTEMPTING TO RETRIEVE USER
        const user = await userModel.findOne({ email })

        // CHECKING IF USER HAS BEEN FOUND
        if (!user) {
            return res.status(404).json({ error: "Couldn't find user." })
        }

        // CHECKING IF USER OWNS POST
        if (post.poster.toString() === user._id.toString()) {
            return res.status(400).json({ error: "You cannot dislike your own post." })
        }

        // CHECKING IF USER HAS ALREADY LIKED THE POST
        var alreadyDisliked;
        post.dislikes.map((dislike) => {
            if (dislike.toString() === user._id.toString()) {
                alreadyDisliked = dislike.toString()
            }
        })

        // REMOVING DISLIKE IF USER HAS ALREADY DISLIKED IT
        if (alreadyDisliked) {
            await postModel.updateOne(
                {_id: id},
                {$pull: { "dislikes": {$in: [alreadyDisliked]} }}
            )
            return res.status(200).json({ message: "Dislike removed successfully" })
        }
        
        // UPDATING POST WITH USERS DISLIKE
        const updatedPost = await postModel.findByIdAndUpdate(
            {_id: id},
            { $addToSet: { dislikes: user } },
            { new: true }
        )

        // CHECKING IF POST HAS BEEN UPDATED
        if (!updatedPost) {
            return res.status(400).json({ message: "Couldn't dislike post."})
        }

        // CHECKING IF USER HAS LIKED THE POST OR NOT
        var likeToRemove;
        post.likes.map((like) => {
            if (like.toString() === user._id.toString()) {
                likeToRemove = like.toString()
            }
        })

        // REMOVING LIKE IF USER HAS LIKED THE POST
        if (likeToRemove) {
            await postModel.updateOne(
                {_id: id},
                {$pull: { "likes": {$in: [likeToRemove]} }}
            )
        }

        // RETURNING RESPONSE
        return res.status(201).json({message: "You have disliked a post!" })

    } catch (err) {
        // RETURNING SERVER ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ error: "Internal server error." + err })
    }
}

// DELETE POST ------------------------------------------------------------------------------------
const deletePost = async (req, res) => {
    // RETRIEVING VALUES FROM REQUEST BODY
    const { selectedPostID, userEmail } = req.body

    // CHECKING IF ID IS VALID
    if (!mongoose.Types.ObjectId.isValid(selectedPostID)) {
        return res.status(400).json({ error: "Invalid post ID." })
    }

    // CHECKING USER EMAIL IS PROVIDED
    if (!userEmail) {
        return res.status(400).json({ error: "No user email address provided." })
    }

    // ATTEMPTING TO DELETE POST
    try {
        // ATTEMPTING TO FIND POST BY ID
        const selectedPost = await postModel.findById(selectedPostID)

        // CHECKING IF POST HAS BEEN FOUND
        if (!selectedPost) {
            return res.status(404).json({ error: "Could not find post in database." })
        }

        // ATTEMPTING TO RETRIEVE USER
        const user = await userModel.findOne({ email: userEmail })

        // CHECKING IF USER HAS BEEN FOUND
        if (!user) {
            return res.status(404).json({ error: "Could not find user in database." })
        }

        // CHECKING IF USER OWNS THE POST OR NOT
        if (!user._id.toString() == selectedPost.poster.toString()) {
            return res.status(401).json({ error: "You are not authorized to delete this post!" })
        }

        // ATTEMPTING TO DELETE POST
        const post = await postModel.findByIdAndDelete(selectedPostID)

        // CHECKING IF POST WAS DELETED
        if (!post) {
            return res.status(404).json({ error: "Could not delete post." })
        }

        // RETURNING OK RESPONSE
        return res.status(200).json({ message: "Post deleted successfully" })
    } catch (err) {
        // RETURNING SERVER ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ error: "Internal server error." + err })
    }
}

// UPDATE POST ------------------------------------------------------------------------------------
const updatePost = async (req, res) => {
    // RETRIEVING REQUEST BODY VALUES
    const {
        loggedInUser,
        postID,
        title,
        content,
        date,
        country
    } = req.body;

    // CHECKING IF PROVIDED ID IS VALID
    if (!mongoose.Types.ObjectId.isValid(postID)) {
        return res.status(400).json({ error: "Invalid post ID." })
    }

    // CHECKING IF USER IS LOGGED IN
    if (!loggedInUser) {
        return res.status(400).json({ error: "You need to log in to use this functionality." })
    }

    // CHECKING IF FIELD HAS BEEN FIELD
    if (!title || !content || !date || !country) {
        return res.status(400).json({ error: "Field cannot be empty." })
    }

    // ATTEMPTING TO UPDATE POST
    try {
        // TRYING TO FIND POST IN DB
        const post = await postModel.findById(postID)

        // CHECKING IF POST WAS FOUND
        if (!post) {
            return res.status(404).json({ error: "Couldn't find post." })
        }

        // TRYING TO FIND USER IN DB
        const user = await userModel.findOne({ email: loggedInUser })

        // CHECKING IF USER WAS FOUND IN DB
        if (!user) {
            return res.status(404).json({ error: "Couldn't find user." })
        }

        // CHECKING IF USER OWNS POST
        if (post.poster.toString() !== user._id.toString()) {
            return res.status(400).json({ error: "You are not authorized to update this post." })
        }   

        // STORING UPDATE INFORMATION IN 'updateInfo' OBJECT
        const updateInfo = {
            title: title,
            content: content,
            date: date,
            country: country
        }

        // UPDATING POST USING OBJECT
        const updatedPost = await postModel.findOneAndUpdate(
            {_id: postID}, 
            updateInfo,
            {new: true}
        )

        // CHECKING IF POST HAS BEEN UPDATED
        if (!updatedPost) {
            return res.status(404).json({ error: "Couldn't update post." })
        }

        // RETURNING OK RESPONSE
        return res.status(200).json({ message: "Post has been updated.", post: updatedPost })
    } catch (err) {
        // RETURNING SERVER ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ error: "Internal server error." + err })
    }
}

// ADD COMMENT TO POST ----------------------------------------------------------------------------
const addComment = async (req, res) => {
    // RETRIEVING VALUES OF REQUEST BODY
    const {poster, content, postID} = req.body;

    // CHECKING IF USER IS LOGGED IN
    if (!poster) {
        return res.status(401).json({ error: "You are not authorized to use this functionality" })
    }

    // CHECKING IF CONTENT FIELD IS EMPTY OR NOT
    if (!content) {
        return res.status(400).json({ error: "Content field cannot be empty" })
    }

    // CHECKING IF POST ID IS VALID
    if (!mongoose.Types.ObjectId.isValid(postID)) {
        return res.status(400).json({ error: "Invalid post ID." })
    }

    // ATTEMPTING TO ADD COMMENT
    try {
        // RETRIEVING POST
        const post = await postModel.findById(postID)

        // CHECKING IF POST WAS FOUND
        if (!post) {
            return res.status(404).json({ error: "Couldn't find post." })
        }

        // RETRIEVING USER
        const user = await userModel.findOne({ email: poster })

        // CHECKING IF USER WAS FOUND
        if (!user) {
            return res.status(404).json({ error: "Couldn't find user." })
        }

        // CREATING 'comment' OBJECT
        const comment = {
            poster: user,
            content: content
        }

        // ATTEMPTING TO ADD COMMENT
        const updatedPost = await postModel.findByIdAndUpdate(
            {_id: postID},
            { $addToSet: { comments: comment } },
            { new: true }
        )

        // CHECKING IF COMMENT WAS ADDED
        if (!updatedPost) {
            return res.status(400).json({ error: "Could not add comment." })
        }

        // RETURNING OK RESPONSE
        return res.status(200).json({ message: "Comment successfully added." })
    } catch (err) {
        // RETURNING SERVER ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ error: "Internal server error." + err })
    }
}

// GETTING SINGLE USER'S POSTS --------------------------------------------------------------------
const getUserSpecificPosts = async (req, res) => {
    // RETRIEVING REQUEST BODY VALUES
    const {userID} = req.body;

    // CHECKING IF USER ID HAS BEEN PROVIDED
    if (!userID) {
        return res.status(400).json({ error: "User ID needs to be provided." })
    }

    // ATTEMPTING TO GET INFO
    try {
        // RETRIEVING ALL POSTS
        const allPosts = await postModel.find({}).sort({ createdAt: -1 })

        // CHECKING IF POSTS COULD BE RETRIEVED
        if (!allPosts) {
            return res.status(400).json({ error: "Couln't find posts." })
        }

        // ATTEMPTING TO GET USER
        const user = await userModel.findById(userID)

        // CHECKING IF USER WAS FOUND
        if (!user) {
            return res.status(400).json({ error: "Couln't find user in database." })
        }

        // STORING USER'S POST IN "usersPosts" ARRAY
        var usersPosts = []
        allPosts.map((post) => {
            if (post.poster.toString() === user._id.toString()) {
                usersPosts.push(post)
            }
        })

        // RETURNING FOUND POSTS (EVEN IF EMPTY)
        return res.status(200).json(usersPosts)
    } catch (err) {
        // RETURNING SERVER ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ error: "Internal server error." })
    }
}

// GET FOLLOWING FEED -----------------------------------------------------------------------------
const getFollowingPosts = async (req, res) => {
    // RETRIEVING REQUEST BODY VALUES
    const {userID} = req.body

    // CHECKING IF USER ID IS PROVIDED
    if (!userID) {
        return res.status(400).json({ error: "User ID needs to be provided." })
    }

    // ATTEMPTING TO RETRIEVE FOLLOWING FEED
    try {
        // RETRIEVING USR
        const user = await userModel.findById(userID)

        // CHECKING IF USER WAS FOUND
        if (!user) {
            return res.status(400).json({ error: "Couln't find user in database." })
        }

        // RETRIEVING ALL POSTS
        const allPosts = await postModel.find({}).sort({ createdAt: -1 })

        // CHECKING IF POSTS WERE RETRIEVED
        if (!allPosts) {
            return res.status(400).json({ error: "Couln't get posts." })
        }

        // STORING POSTS OF FOLLOWED USER IN 'followingArray' ARRAY
        var followingArray = [];
        allPosts.map((post) => {
            user.following.map((follow) => {
                if (post.poster.toString() === follow.toString()) {
                    followingArray.push(post)
                }
            })
        })

        // RETURNING OK RESPONSE
        return res.status(200).json(followingArray)
    } catch (err) {
        // RETURNING SERVER ERROR IF SOMETHING WENT WRONG
        return res.status(500).json({ error: "Internal server error." })
    }
}

// RETRIEVING TRENDING POSTS ----------------------------------------------------------------------
const trendingPosts = async (req, res) => {
    // ATTEMPTING TO RETRIEVE TRENDY POSTS
    try {
        // RETRIEVING ALL POSTS
        const allPosts = await postModel.find({}).sort({ createdAt: -1 })

        // CHECKING IF POSTS HAVE BEEN RETRIEVED
        if (!allPosts) {
            return res.status(400).json({ error: "Couln't get posts." })
        }

        // ESTABLISHING VARIABLES FOR POSTS THAT MATCH CRITERIA
        var latestPost;
        var mostLiked;
        var mostComments;

        // RETRIEVING POSTS WITH: - MOST LIKES; - MOST COMMENTS; - LATES CREATION DATE
        allPosts.map((post) => {
            if (!mostLiked || post.likes.length > mostLiked.likes.lenght) {
                mostLiked = post
            }
            if (!mostComments || post.comments.length > mostComments.comments.length) {
                mostComments = post
            }

            latestPost = post
        })

        // CHECKING IF ALL POSTS HAVE BEEN RETRIEVED
        if (!latestPost || !mostLiked || !mostComments) {
            return res.status(404).json({ error: "Couln't get posts." })
        }

        // STORING POSTS IN A SINGLE ARRAY
        var popularPosts = []
        popularPosts.push(latestPost, mostLiked, mostComments)

        // CHECKING IF ARRAY STORED THE POSTS
        if (!popularPosts) {
            return res.status(404).json({ error: "Couln't get popular posts." })
        }

        // RETURNING POPULAR POSTS
        return res.status(200).json(popularPosts)
    } catch (err) {
        // RETURNING SERVER ERROR
        return res.status(500).json({ error: "Internal server error." })
    }
}

// EXPORTS ----------------------------------------------------------------------------------------
module.exports = {
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
}

// END OF DOCUMENT --------------------------------------------------------------------------------