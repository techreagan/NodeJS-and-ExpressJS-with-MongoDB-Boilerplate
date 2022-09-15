const { resolve, dirname } = require('path')

const nodemailer = require('nodemailer')
const Email = require('email-templates')

const sendEmail = async ({ email, locals, template }) => {
	console.log('sendemail', email)
	const emailObj = new Email({
		message: {
			from: { name: process.env.FROM_NAME, address: process.env.FROM_EMAIL },
		},
		// uncomment below to send emails in development/test env:
		send: true,
		transport: nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			auth: {
				user: process.env.SMTP_EMAIL,
				pass: process.env.SMTP_PASSWORD,
			},
		}),
		views: {
			root: resolve(dirname(__dirname) + '/emails/'),
			options: {
				extension: 'njk',
			},
		},
		// preview: false,
	})

	const mail = await emailObj.send({
		template,
		message: {
			to: email,
		},
		locals: {
			...locals,
		},
	})
	console.log('Message sent: %s', mail.messageId)
}

module.exports = sendEmail
