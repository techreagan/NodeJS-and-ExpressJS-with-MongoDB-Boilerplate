declare namespace Express {
	export interface Request {
		user: {
			[key: string]: string
		}
	}
}

declare namespace Express {
	export interface Response {
		advancedResults?: {}
	}
}
