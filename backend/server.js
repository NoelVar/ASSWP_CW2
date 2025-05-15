// NOTE: IMPORTS ----------------------------------------------------------------------------------
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const authRoute = require('./routes/authRoute')
const userRoute = require('./routes/userRoute')
const apiKeyRoute = require('./routes/apiKeyRoute')
const postRoute = require('./routes/postRoute')
const cors = require('cors')

// INITIALIZE APP
const app = express()

app.use(express.json())

// CORS FOR FRONTEND
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// DEBUG: THIS PART IS FOR DEVELOPMENT
// app.use((req, res, next) => {
//     console.log("Request path: " + req.path, " Request method: " + req.method)
//     next()
// })

// NOTE: ROUTES
app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/api', apiKeyRoute)
app.use('/post', postRoute)

// NOTE: DB CONNECTION
mongoose.connect(process.env.DB_CONNECTION)
    .then(() => {
        //NOTE: LISTENING FOR REQUESTS
        app.listen(7000, () => {
            console.log('Listening on port 7000')
        })

    })
    .catch((error) => {
        console.error({message: "ERROR during database connection. " + error})
    })

// END OF DOCUMENT --------------------------------------------------------------------------------