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
	emailVerification,
	sendEmailVerification,
} = require('./auth.controller')

const { protect } = require('../auth/auth.middleware')

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/me', protect, getMe)
router.put('/updatedetails', protect, updateDetails)
router.put('/updatepassword', protect, updatePassword)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resettoken', resetPassword)
router.put('/emailverification/:resettoken', emailVerification)
router.post('/sendemailverification', sendEmailVerification)

module.exports = router
