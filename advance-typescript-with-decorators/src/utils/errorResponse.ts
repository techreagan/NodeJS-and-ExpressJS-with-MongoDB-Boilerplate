export default class ErrorResponse extends Error {
	constructor(
		message: string | null,
		public statusCode: number | null = null,
		public messageWithField: null | object = null
	) {
		super(message === null ? '' : message)
	}
}
