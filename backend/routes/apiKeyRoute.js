// NOTE: IMPORTS ----------------------------------------------------------------------------------
const express = require('express')
const { 
    genApiKey,
    getApiKeys,
    activateApiKey,
    deactivateAllKeys,
    deleteAPIkey,
    getAllAPIkeys
} = require('../controllers/apiController')
const authCheck = require('../middleware/authCheck')

// NOTE: CREATING ROUTER
const router = express.Router()

router.use(authCheck)

// NOTE: GENERATE KEY
router.post('/generate-key', genApiKey)

// NOTE: GET ALL API KEYS
router.post('/all-user-keys', getApiKeys)

// NOTE: ACTIVATES ALL KEYS
router.post('/activate-key', activateApiKey)

// NOTE: DEACTIVATE ALL KEYS
router.post('/deactivate-key', deactivateAllKeys)

// NOTE: DELETE API KEY
router.post('/delete-key', deleteAPIkey)

// NOTE: DELETE API KEY
router.get('/get-all-keys', getAllAPIkeys)

module.exports = router
// END OF DOCUMENT --------------------------------------------------------------------------------