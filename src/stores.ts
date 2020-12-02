import { get, writable } from "svelte/store"
import { fetchLatestTweets, Tweet } from "./client"

export const roundNumbers = 6

function createTweetsStore() {
	const { subscribe, set } = writable<Tweet[]>([])
	return {
		subscribe,
		async fetch() {
			const tweets = await fetchLatestTweets()
			set(tweets)
		},
		randOne(): Tweet {
			const tweets = get(tweetsStore)
			return tweets[Math.floor(Math.random() * tweets.length)]
		},
	}
}

export const tweetsStore = createTweetsStore()

type Game = { scores: number[] } & (NotStarted | Round | End)

interface NotStarted {
	state: "not_started"
}

interface Round {
	state: "round"
	roundNumber: number
	tweet: Tweet
	seenTweets: Set<string>
}

interface End {
	state: "done"
}

function createGameStore() {
	const { subscribe, update } = writable<Game>({
		state: "not_started",
		scores: [],
	})
	return {
		subscribe,
		next() {
			update(g => {
				switch (g.state) {
					case "not_started":
						return {
							state: "round", roundNumber: 1,
							tweet: tweetsStore.randOne(),
							seenTweets: new Set(),
							scores: [],
						}
					case "round":
						if (g.roundNumber < roundNumbers) {
							g.roundNumber += 1
							do {
								g.tweet = tweetsStore.randOne()
							} while (g.seenTweets.has(g.tweet.id))
							g.seenTweets.add(g.tweet.id)
							return g
						}
						return { state: "done", scores: g.scores }
					case "done":
						return { state: "not_started", scores: [] }
				}
			})
		},
		setRoundScore(score: number) {
			update(g => {
				if (g.state === "round")
					g.scores.push(score)
				return g
			})
		}
	}
}

export const gameStore = createGameStore()
