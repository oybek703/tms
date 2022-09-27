declare namespace Express {
	export interface Request {
		user: {
			ID: number
			USERNAME: string
			PASSWORD: string
			ROLE: string
			ALLOWED_PAGES: string
		}
	}
}
