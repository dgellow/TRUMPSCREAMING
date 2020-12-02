const fileDataCapitalized = "/data_capitalized.json"

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

export async function fetchLatestTweets(target = fileDataCapitalized) {
	const req = new Request(target)
	const res = await fetch(req)
	if (!res.ok) {
		console.error("failed to fetch tweets")
		throw new UnexpectedAPIError(req, res)
	}
	const obj = await res.json()
	return obj as Tweet[]
}

const minCapitalLetters = 2
const minCapitalWords = 2

export function filterTweetsCapitalized(tweets: Tweet[]) {
	return tweets.filter(tweet => {
		// ignore all lowercase tweets
		if (tweet.text === tweet.text.toLowerCase()) return false
		// ignore retweets
		if (tweet.text.startsWith("RT ")) return false

		const words = tweet.text.split(/\s/).reduce<string[]>((acc, curr) => {
			if (curr === "") return acc
			// ignore retweets
			if (curr.toUpperCase() === "RT") return acc
			// ignore twitter usernames
			if (curr[0] === "@") return acc
			// ignore hashtags
			if (curr[0] === "#") return acc
			// ignore links
			if (curr.includes("://")) return acc

			acc.push(curr)
			return acc
		}, [])

		// ignore full caps tweets
		if (words.every(value => value === value.toUpperCase())) return false

		const capitalizedWords = words.reduce<string[]>((acc, curr) => {
			// only count words with at least 'minCapitalLetters' letters in full caps
			let count = 0
			for (const c of curr) {
				if (/[A-Z]/.test(c)) count++ // found an uppercase letter
				else count = 0 // reset counter when a non uppercase letter is found

				if (count >= minCapitalLetters) {
					acc.push(curr)
					break
				}
			}
			return acc
		}, [])

		// ignore full uppercase tweets
		// if (capitalizedWords.every(value => value === value.toUpperCase())) return false

		return capitalizedWords.length > minCapitalWords
	})
}
