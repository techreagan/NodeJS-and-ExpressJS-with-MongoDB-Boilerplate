const express = require('express')
const router = express.Router()

const {
	register,
	login,
	logout,
	getMe,
	forgotPassword,
	resetPassword,
	updateDetails,
	updatePassword,
} = require('./auth.controller')

const { protect } = require('../../middleware/auth')

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/me', protect, getMe)
router.put('/updatedetails', protect, updateDetails)
router.put('/updatepassword', protect, updatePassword)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resettoken', resetPassword)

module.exports = router
