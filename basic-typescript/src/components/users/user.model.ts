import crypto from 'crypto'
import { Schema, Model, model } from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import uniqueValidator from 'mongoose-unique-validator'

export interface IUser {
	name: string
	email: string
	role?: string
	password: string
	isEmailVerified: boolean
	emailVerificationToken: string
	emailVerificationExpire: Date
	resetPasswordToken: string
	resetPasswordExpire: Date
}

// Put all user instance methods in this interface:
interface IUserMethods {
	matchPassword(password: string): Promise<boolean>
	getSignedJwtToken(): string
	getEmailVerificationToken(): string
	getResetPasswordToken(): string
}

// Create a new Model type that knows about IUserMethods...
type UserModel = Model<IUser, {}, IUserMethods>

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
	{
		name: {
			type: String,
			required: [true, 'Please add a name'],
		},
		email: {
			type: String,
			required: [true, 'Please add an email'],
			unique: true,
			uniqueCaseInsensitive: true,
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				'Please add a valid email',
			],
		},
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user',
		},
		password: {
			type: String,
			required: [true, 'Please add a password'],
			minlength: [6, 'Must be six characters long'],
			select: false,
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		emailVerificationToken: String,
		emailVerificationExpire: Date,
		resetPasswordToken: String,
		resetPasswordExpire: Date,
	},
	{
		timestamps: true,
	}
)

UserSchema.plugin(uniqueValidator, { message: '{PATH} already exists.' })

// Ecrypt Password
UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next()
	}

	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
	return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.methods.getSignedJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	})
}

UserSchema.methods.getEmailVerificationToken = function () {
	const resetToken = crypto.randomBytes(20).toString('hex')

	this.emailVerificationToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex')

	this.emailVerificationExpire =
		Date.now() + 60 * 1000 * process.env.EMAIL_VERIFICATION_EXPIRATION_TIME

	return resetToken
}

UserSchema.methods.getResetPasswordToken = function () {
	// Generate token
	const resetToken = crypto.randomBytes(20).toString('hex')

	// Hash token and set to resetPasswordToken field
	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex')

	// Set expire
	this.resetPasswordExpire =
		Date.now() + 60 * 1000 * process.env.RESET_PASSWORD_EXPIRATION_TIME

	return resetToken
}

export default model<IUser, UserModel>('User', UserSchema)
