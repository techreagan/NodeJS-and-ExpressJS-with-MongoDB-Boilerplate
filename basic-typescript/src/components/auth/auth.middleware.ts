import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import asyncHandler from '../../middleware/async'
import ErrorResponse from '../../utils/errorResponse'
import User from '../users/user.model'

export const protect = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		let token

		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer')
		) {
			token = req.headers.authorization.split(' ')[1]
		}
		// Set token from cookie
		// else if (req.cookies.token) {
		//   token = req.cookies.token
		// }

		if (!token) {
			return next(new ErrorResponse('Not authorized to access this route', 401))
		}

		try {
			// Verify token
			const decoded = jwt.verify(token, process.env.JWT_SECRET)

			req.user = await User.findById(decoded.id)
			next()
		} catch (err) {
			return next(new ErrorResponse('Not authorized to access this route', 401))
		}
	}
)

// Grant access to specific roles
export const authorize = (...roles) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorResponse(
					`User role ${req.user.role} is not authorized to access this route`,
					403
				)
			)
		}
		next()
	}
}
