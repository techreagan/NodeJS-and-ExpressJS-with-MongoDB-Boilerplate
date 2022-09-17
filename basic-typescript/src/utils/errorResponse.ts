export default class ErrorResponse extends Error {
	public statusCode: number
	public messageWithField: null | object

	constructor(
		message: string | null,
		statusCode: number,
		messageWithField: null | object = null
	) {
		super(message === null ? '' : message)

		this.statusCode = statusCode
		this.messageWithField = messageWithField
	}
}
