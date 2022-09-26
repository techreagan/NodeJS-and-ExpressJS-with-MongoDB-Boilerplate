import { NextFunction, Request, Response } from 'express'

import User from './user.model'

import { get, controller, post, use, put, del } from '../../decorators'
import ErrorResponse from '../../utils/errorResponse'
import advancedResults from '../../middleware/advancedResults'
import { protect, authorize } from '../auth/auth.middleware'

@controller('/api/v1/users')
// @ts-ignore
class UserController {
	// @desc    Get all users
	// @route   GET /api/v1/users
	// @access  Private/Admin
	@get('/')
	@use(advancedResults(User))
	@use(authorize('admin'))
	@use(protect)
	async getUsers(_: Request, res: Response) {
		res.status(200).json(res.advancedResults)
	}

	// @desc    Get single user
	// @route   GET /api/v1/users/:id
	// @access  Private/Admin
	@get('/:id')
	@use(authorize('admin'))
	@use(protect)
	async getUser(req: Request, res: Response, next: NextFunction) {
		const user = await User.findById(req.params.id)

		if (!user)
			return next(new ErrorResponse(`No user with that id of ${req.params.id}`))

		res.status(200).json({ success: true, data: user })
	}

	// @desc    Create user
	// @route   POST /api/v1/users
	// @access  Private/Admin
	@post('/')
	@use(authorize('admin'))
	@use(protect)
	async createUser(req: Request, res: Response) {
		const user = await User.create(req.body)

		res.status(201).json({ success: true, data: user })
	}

	// @desc    Update user
	// @route   PUT /api/v1/users/:id
	// @access  Private/Admin
	@put('/:id')
	@use(authorize('admin'))
	@use(protect)
	async updateUser(req: Request, res: Response, next: NextFunction) {
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

	// @desc    Delete user
	// @route   DELETE /api/v1/users/:id
	// @access  Private/Admin
	@del('/:id')
	@use(authorize('admin'))
	@use(protect)
	async deleteUser(req: Request, res: Response, next: NextFunction) {
		const user = await User.findById(req.params.id)

		if (!user)
			return next(new ErrorResponse(`No user with that id of ${req.params.id}`))

		await User.findByIdAndDelete(req.params.id)

		res.status(200).json({ success: true, data: {} })
	}
}
