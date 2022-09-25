import { Router } from 'express'
import {
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
} from './users.controller'

import User from './user.model'

const router = Router({ mergeParams: true })

import advancedResults from '../../middleware/advancedResults'
import { protect, authorize } from '../auth/auth.middleware'

router.use(protect)
router.use(authorize('admin'))

router.route('/').get(advancedResults(User), getUsers).post(createUser)

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser)

export default router
