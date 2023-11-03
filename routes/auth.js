const {
    registerUser,
    loginUser
} = require('../controllers/auth')
const express = require("express")
const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)

module.exports = router
