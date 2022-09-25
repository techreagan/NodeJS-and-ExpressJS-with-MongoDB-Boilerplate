import { NextFunction, Request, Response } from 'express'

import asyncHandler from '../../middleware/async'
import ErrorResponse from '../../utils/errorResponse'
import User from './user.model'

// @desc    Get all users
// @route   GET /api/v1/auth/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (_: Request, res: Response) => {
	res.status(200).json(res.advancedResults)
})

// @desc    Get single user
// @route   GET /api/v1/auth/users/:id
// @access  Private/Admin
export const getUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = await User.findById(req.params.id)

		if (!user)
			return next(new ErrorResponse(`No user with that id of ${req.params.id}`))

		res.status(200).json({ success: true, data: user })
	}
)

// @desc    Create user
// @route   POST /api/v1/auth/users
// @access  Private/Admin
export const createUser = asyncHandler(async (req: Request, res: Response) => {
	const user = await User.create(req.body)

	res.status(201).json({ success: true, data: user })
})

// @desc    Update user
// @route   PUT /api/v1/auth/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		req.body.password = ''
		delete req.body.password

		const user = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		})

		if (!user)
			return next(new ErrorResponse(`No user with that id of ${req.params.id}`))

		res.status(200).json({ success: true, data: user })
	}
)

// @desc    Delete user
// @route   DELETE /api/v1/auth/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const user = await User.findById(req.params.id)

		if (!user)
			return next(new ErrorResponse(`No user with that id of ${req.params.id}`))

		await User.findByIdAndDelete(req.params.id)

		res.status(200).json({ success: true, data: {} })
	}
)
