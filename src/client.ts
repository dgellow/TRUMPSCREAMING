const apiUrl = "/data.json"

export interface Tweet {
	id: string
	text: string
	isRetweet: boolean
	isDeleted: boolean
	device: string
	favorites: string
	retweets: string
	date: string
}

export class UnexpectedAPIError extends Error {
	constructor(req: Request, res: Response) {
		super(`unexpected api error: ${req.method} ${req.url} => ${res.status} ${res.statusText}`)
		this.name = "UnexpectedAPIError"
	}
}

export async function fetchLatestTweets() {
	const req = new Request(apiUrl)
	const res = await fetch(req)
	if (!res.ok) {
		console.error("failed to fetch tweets")
		throw new UnexpectedAPIError(req, res)
	}
	const obj = await res.json()
	return obj as Tweet[]
}
