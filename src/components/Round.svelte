<script lang="ts">
	import { tick } from "svelte"

	import { fade } from "svelte/transition"
	import App from "../App.svelte"
	import type { Tweet } from "../client"

	import { gameStore, roundNumbers } from "../stores"
	let round = 0
	let tweet: Tweet
	$: {
		const game = $gameStore
		if (game.state === "round") {
			round = game.roundNumber
			tweet = game.tweet
		}
	}

	let words: string[] = []
	$: words = tweet.text.split(/\s/).reduce((acc, curr) => {
		// ignore links
		if (curr.startsWith("http")) return acc

		// no html encoding
		if (curr === "&amp;") curr = "&"

		// sometime words are followed by a link, without a space between them
		const split = curr.split("https")
		if (split.length !== 1) {
			curr = ""
			// only conider chunks that don't look like links
			for (const chunk of split) if (!chunk.startsWith("://")) curr += chunk
		}

		acc.push(curr)
		return acc
	}, [])

	// indices selectable
	let choices = new Set<number>()
	$: choices = words.reduce((acc, curr, index) => {
		// ignore short words
		if (curr.length <= 1) return acc
		// ignore words that are mixed caps
		if (curr !== curr.toUpperCase() && curr !== curr.toLowerCase()) return acc
		// ignore '@'
		if (curr[0] === "@") return acc
		// ignore words starting with '.'
		if (curr[0] === ".") return acc

		acc.add(index)
		return acc
	}, new Set<number>())

	// indices capitalized by user. Key is the word index, value defines if capitalized by player.
	let playerChoice = new Map<number, boolean>()
	$: playerChoice = [...choices].reduce((acc, curr) => acc.set(curr, false), new Map<number, boolean>())

	let tweetWidget: Element
	let tweetRendering: Promise<Element>

	let submitted = false
	let score = 100
	$: results = words.map(() => false)
	const verify = async () => {
		submitted = true
		score = 100 // reset the score
		const percentagePerWord = Math.floor(100 / words.length)

		// check what words are correctly capitalized
		for (const i of choices) {
			// if selected by user, then uppercase
			const playerWord = playerChoice[i] ? words[i].toUpperCase() : words[i].toLowerCase()
			// did we match the tweet?
			const ok = words[i] === playerWord
			if (!ok) {
				// no, then reduce the score
				score -= percentagePerWord
			}
			results[i] = ok
			score = Math.floor(score) // decimal aren't relevant

			// render tweet
		}
		if (tweetWidget.childElementCount === 0)
			tweetRendering = twttr.widgets.createTweetEmbed(tweet.id, tweetWidget, {
				cards: "hidden",
				conversation: "none",
				dnt: true,
			})
	}

	const toggle = (index: number) => {
		playerChoice[index] = !playerChoice[index]
	}
	const cont = () => {
		submitted = false
		tweetWidget.textContent = ""
		gameStore.next()
	}
</script>

<div>
	<h2>Round #{round} on {roundNumbers}</h2>
	<p class="tweet">
		{#if submitted}
			{#each words as word, index}
				{#if choices.has(index)}
					<span
						class="word"
						class:correct={word === (playerChoice[index] ? word.toUpperCase() : word.toLowerCase())}
						class:incorrect={word !== (playerChoice[index] ? word.toUpperCase() : word.toLowerCase())}>
						{words[index]}
					</span>
				{:else}<span class="word">{word}</span>{/if}
			{/each}
		{:else}
			{#each words as word, index}
				{#if choices.has(index)}
					<span class="word selectable" class:uppercase={playerChoice[index]} on:click={() => toggle(index)}>
						{#if playerChoice[index]}{words[index].toUpperCase()}{:else}{words[index].toLowerCase()}{/if}
					</span>
				{:else}<span class="word">{word}</span>{/if}
			{/each}
		{/if}
	</p>
	{#await tweetRendering}
		<p>Loading tweet ...</p>
	{:catch err}
		<p style="color: red; font-weight: bold">Failed to load tweet: {err}</p>
	{/await}
	<div bind:this={tweetWidget} />

	{#if !submitted}
		<button on:click={() => verify()}>Verify</button>
	{:else}
		<p>Score: {score}%</p>
		<p>Source: <a href="https://twitter.com/realDonaldTrump/status/{tweet.id}" target="_blank">#{tweet.id}</a></p>
		<button on:click={() => cont()}>Continue</button>
	{/if}
</div>

<style>
	.tweet {
		display: flex;
		flex-wrap: wrap;
		font-size: 1.2em;
		font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
	}

	.word {
		margin-right: 5px;
		color: rgb(65, 65, 65);
	}
	.selectable {
		color: black;
		cursor: pointer;
		border-bottom: 2px solid orange;
	}

	.selectable:hover {
		background-color: lightgrey;
	}

	.selectable.uppercase {
		background-color: rgb(248, 197, 31);
	}

	.word.correct {
		background-color: lightgreen;
	}

	.word.incorrect {
		background-color: rgb(255, 107, 107);
	}
</style>
