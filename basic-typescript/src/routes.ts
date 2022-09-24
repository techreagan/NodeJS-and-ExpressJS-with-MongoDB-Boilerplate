import { Express } from 'express'
import authRoutes from './components/auth/auth.routes'
import userRoutes from './components/users/users.routes'

const versionOne = (routeName: string) => `/api/v1/${routeName}`

module.exports = (app: Express) => {
	app.use(versionOne('auth'), authRoutes)
	app.use(versionOne('users'), userRoutes)
}
