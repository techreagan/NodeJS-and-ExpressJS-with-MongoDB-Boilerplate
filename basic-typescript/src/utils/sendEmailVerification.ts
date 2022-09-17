const sendEmail = require('./sendEmail')
// const errorResponse = require('./errorResponse')

async function sendEmailVerification(user, req) {
	const resetToken = user.getEmailVerificationToken()

	await user.save({ validateBeforeSave: false })

	try {
		await sendEmail({
			template: 'verify-email',
			email: user.email,
			locals: {
				name: user.name,
				link: `${req.protocol}://${req.get(
					'host'
				)}/api/v1/auth/verify-email/${resetToken}`,
			},
		})

		// res.status(200).json({ success: true, data: 'Email sent' })
		return true
	} catch (err) {
		console.log(err)
		user.isEmailVerified = false
		user.emailVerificationToken = undefined
		user.emailVerificationExpire = undefined

		await user.save({ validateBeforeSave: false })
		return false
		// return next(new ErrorResponse('Email could not be sent', 500))
	}
}

module.exports = sendEmailVerification
