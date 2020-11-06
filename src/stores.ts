import { writable } from "svelte/store"
import { fetchLatestTweets, Tweet } from "./client"

const minCapitalLetters = 2

function createStore() {
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
							console.log("curr", curr, "count", count)
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

	}
}

export const tweetsStore = createStore()