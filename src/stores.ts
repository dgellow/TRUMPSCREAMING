import { get, writable } from "svelte/store"
import { fetchLatestTweets, Tweet } from "./client"

export const roundNumbers = 6
const minCapitalLetters = 2
const minCapitalWords = 2


function createTweetsStore() {
	const { subscribe, set } = writable<Tweet[]>([])
	return {
		subscribe,
		async fetch() {
			const tweets = await fetchLatestTweets()
			const capitalized = tweets.filter(tweet => {
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
			set(capitalized)
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
