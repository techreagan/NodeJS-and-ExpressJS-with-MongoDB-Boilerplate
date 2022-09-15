const crypto = require('crypto')
const asyncHandler = require('../../middleware/async')
const ErrorResponse = require('../../utils/errorResponse')
const sendEmail = require('../../utils/sendEmail')
const sendEmailVerification = require('../../utils/sendEmailVerification')

const User = require('../users/user.model')

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
	let { name, email, password, role } = req.body

	email = email.toLowerCase()

	user = await User.create({
		name,
		email,
		password,
		role,
	})

	sendEmailVerification(user, req)

	sendTokenResponse(user, 200, res)
})

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
	let { email, password } = req.body

	if (!email || !password) {
		return next(new ErrorResponse('Please provide an email and password', 400))
	}

	email = email.toLowerCase()

	const user = await User.findOne({ email }).select('+password')

	if (!user) {
		return next(new ErrorResponse('Invalid credentials', 400))
	}

	const isMatch = await user.matchPassword(password)

	if (!isMatch) {
		return next(new ErrorResponse('Invalid credentials', 400))
	}

	sendTokenResponse(user, 200, res)
})

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
	res.cookie('token', 'none', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	})

	res.status(200).json({ success: true, data: {} })
})

// @desc    Get current logged in user
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
	const user = req.user

	res.status(200).json({ success: true, data: user })
})

// @desc    Update user details
// @route   POST /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
	const fieldsToUpdate = {
		name: req.body.name,
		email: req.body.email.toLowerCase(),
	}
	const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
		new: true,
		runValidators: true,
		context: 'query',
	})

	res.status(200).json({ success: true, data: user })
})

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id).select('+password')

	if (!(await user.matchPassword(req.body.currentPassword))) {
		return next(new ErrorResponse('Password is incorrect', 401))
	}

	user.password = req.body.newPassword
	await user.save()

	sendTokenResponse(user, 200, res)
})

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email.toLowerCase() })

	if (!user) {
		return next(new ErrorResponse('There is no user with that email', 404))
	}

	const resetToken = user.getResetPasswordToken()

	await user.save({ validateBeforeSave: false })

	const resetUrl = `${req.protocol}://${req.get(
		'host'
	)}/api/v1/auth/resetpassword/${resetToken}`

	// const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`

	try {
		await sendEmail({
			template: 'forgot-password',
			email: user.email,
			locals: {
				link: resetUrl,
			},
		})
		res.status(200).json({ success: true, data: 'Email sent' })
	} catch (err) {
		console.log(err)
		user.resetPasswordToken = undefined
		user.resetPasswordExpire = undefined

		await user.save({ validateBeforeSave: false })

		return next(new ErrorResponse('Email could not be sent', 500))
	}
})

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
	// Get hashed token
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.resettoken)
		.digest('hex')

	console.log(resetPasswordToken)

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	})

	if (!user) {
		return next(new ErrorResponse('Invalid token', 400))
	}

	// Set new password
	user.password = req.body.password
	user.resetPasswordToken = undefined
	user.resetPasswordExpire = undefined
	await user.save()

	sendTokenResponse(user, 200, res)
})

// @desc    Email verification
// @route   PUT /api/v1/auth/emailverification/:resettoken
// @access  Public
exports.emailVerification = asyncHandler(async (req, res, next) => {
	// Get hashed token
	const emailVerificationToken = crypto
		.createHash('sha256')
		.update(req.params.resettoken)
		.digest('hex')

	console.log(emailVerificationToken)

	const user = await User.findOne({
		emailVerificationToken,
		emailVerificationExpire: { $gt: Date.now() },
	})

	if (!user) {
		return next(new ErrorResponse('Email verification link has expired', 400))
	}

	user.isEmailVerified = true
	user.emailVerificationToken = undefined
	user.emailVerificationExpire = undefined
	await user.save()

	res.status(200).json({ success: true, data: user })
})

// @desc    Send Email Verification
// @route   POST /api/v1/auth/sendemailverification
// @access  Public
exports.sendEmailVerification = asyncHandler(async (req, res, next) => {
	if (!req.body.email) {
		return next(new ErrorResponse('Email is required', 400))
	}

	const user = await User.findOne({
		email: req.body.email,
		isEmailVerified: false,
	})

	if (!user) {
		return next(
			new ErrorResponse(
				'User already verified or No user with that email address',
				400
			)
		)
	}

	const isSent = sendEmailVerification(user, req)
	isSent.then((data) => {
		if (!data) {
			return next(new ErrorResponse('Email could not be sent', 500))
		}
		return res.status(200).json({ success: true, data: 'Email sent' })
	})
})

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
	const token = user.getSignedJwtToken()

	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	}

	if (process.env.NODE_ENV === 'production') {
		options.secure = true
	}

	res
		.status(statusCode)
		.cookie('token', token, options)
		.json({ success: true, token })
}
