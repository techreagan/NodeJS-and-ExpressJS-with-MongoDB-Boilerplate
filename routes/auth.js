const express = require('express')
const router = express.Router()

const { register, login, getMe } = require('../controllers/auth')

const { protect } = require('../middleware/auth')

router.post('/register', register)
router.post('/login', login)
router.post('/me', protect, getMe)

module.exports = router
