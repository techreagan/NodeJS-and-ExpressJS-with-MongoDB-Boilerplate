import { Request } from 'express'

import { IUser } from '../components/users/user.model'

import sendEmail from './sendEmail'

export default async function sendEmailVerification(user: IUser, req: Request) {
	const resetToken = user.getEmailVerificationToken()

	await (user as any).save({ validateBeforeSave: false })

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

		await (user as any).save({ validateBeforeSave: false })
		return false
		// return next(new ErrorResponse('Email could not be sent', 500))
	}
}
