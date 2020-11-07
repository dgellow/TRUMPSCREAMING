import { update_keyed_each } from "svelte/internal"
import { get, writable } from "svelte/store"
import { fetchLatestTweets, Tweet } from "./client"

export const roundNumbers = 10
const minCapitalLetters = 2

function createTweetsStore() {
	const { subscribe, set } = writable<Tweet[]>([])
	return {
		subscribe,
		async fetch() {
			const tweets = await fetchLatestTweets()
			const capitalized = tweets.filter(tweet => {
				if (tweet.text.startsWith("RT ")) return false

				const capitalizedWords = tweet.text.split(/\s/).reduce<string[]>((acc: string[], curr: string) => {
					if (curr === "") return acc
					if (curr.toUpperCase() === "RT") return acc
					if (curr[0] === "@") return acc
					if (curr.includes("://")) return acc
					let count = 0
					for (const c of curr) {
						if (/[A-Z]/.test(c)) count++
						else count = 0

						if (count > minCapitalLetters) {
							acc.push(curr)
							break
						}
					}
					return acc
				}, [])
				return capitalizedWords.length > 0
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

type Game = NotStarted | Round | End

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
						return { state: "done" }
					case "done":
						return { state: "not_started" }
				}
			})
		}
	}
}

export const gameStore = createGameStore()
