import express from 'express'
const router = express.Router()

import {
	register,
	login,
	logout,
	getMe,
	forgotPassword,
	resetPassword,
	updateDetails,
	updatePassword,
	emailVerification,
	postSendEmailVerification,
} from './auth.controller'

import { protect } from '../auth/auth.middleware'

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/me', protect, getMe)
router.put('/updatedetails', protect, updateDetails)
router.put('/updatepassword', protect, updatePassword)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resettoken', resetPassword)
router.put('/emailverification/:resettoken', emailVerification)
router.post('/sendemailverification', postSendEmailVerification)

export default router
