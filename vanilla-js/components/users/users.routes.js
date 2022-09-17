const express = require('express')
const {
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
} = require('./users.controller')

const User = require('./user.model')

const router = express.Router({ mergeParams: true })

const advancedResults = require('../../middleware/advancedResults')
const { protect, authorize } = require('../auth/auth.middleware')

router.use(protect)
router.use(authorize('admin'))

router.route('/').get(advancedResults(User), getUsers).post(createUser)

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser)

module.exports = router
