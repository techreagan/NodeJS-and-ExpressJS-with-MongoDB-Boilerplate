const authRoutes = require('./components/auth/auth.routes')
const userRoutes = require('./components/users/users.routes')

const versionOne = (routeName) => `/api/v1/${routeName}`

module.exports = (app) => {
	app.use(versionOne('auth'), authRoutes)
	app.use(versionOne('users'), userRoutes)
}
