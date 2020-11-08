<script lang="ts">
	import { onMount, tick } from "svelte"
	import type { Tweet } from "../client"
	import { gameStore, roundNumbers } from "../stores"

	const adjectives = ["grumpy", "moody"]

	let round = 0
	let tweet: Tweet
	let adjective: string
	$: {
		const game = $gameStore
		if (game.state === "round") {
			round = game.roundNumber
			tweet = game.tweet
			adjective = adjectives[Math.floor(Math.random() * adjectives.length)].toUpperCase()
		}
	}

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	]
	let date: string
	let time: string
	$: {
		const d = new Date(tweet.date)
		const month = months[d.getMonth()]
		const day = d.getDate()
		const hour = d.getHours().toString(10).padStart(2, "0")
		const minutes = d.getMinutes().toString(10).padStart(2, "0")
		date = month + " " + day
		time = hour + ":" + minutes
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
		// ignore non-alpha-numeric
		if (!/[A-Za-z]/.test(curr)) return acc

		acc.add(index)
		return acc
	}, new Set<number>())

	// indices capitalized by user. Key is the word index, value defines if capitalized by player.
	let playerChoice = new Map<number, boolean>()
	$: playerChoice = [...choices].reduce((acc, curr) => acc.set(curr, false), new Map<number, boolean>())

	let tweetWidget: Element
	let tweetRendering: Promise<Element>
	const renderTweet = () => {
		if (!window.twttr) return

		tweetRendering = twttr.widgets.createTweetEmbed(tweet.id, tweetWidget, {
			cards: "hidden",
			conversation: "none",
			dnt: true,
		})
	}

	onMount(renderTweet)

	let submitted = false
	let score = 100
	$: results = [...choices].map(() => false)
	const verify = async () => {
		submitted = true
		score = 100 // reset the score
		const percentagePerWord = Math.floor(100 / choices.size)

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
		}
	}

	const toggle = (index: number) => {
		playerChoice[index] = !playerChoice[index]
	}
	const cont = async () => {
		submitted = false
		gameStore.setRoundScore(score)
		gameStore.next()
		if (round < roundNumbers && window.twttr) {
			tweetWidget.textContent = ""
			await tick()
			renderTweet()
		}
	}
</script>

<div>
	<h2>Round #{round} on {roundNumbers}</h2>
	<p class="instructions">
		<b>Instructions</b>: Select underlined
		<span class="word selectable">words</span>
		to guess which words were
		<span class="word selectable uppercase">SCREAMED</span>!
	</p>
	<div class="tweet">
		<div class="tweet-header">On {date} at {time}, a {adjective} Trump tweeted:</div>
		<p class="tweet-body">
			{#if submitted}
				{#each words as word, index}
					{#if choices.has(index)}
						<span
							class="word"
							class:correct={word === (playerChoice[index] ? word.toUpperCase() : word.toLowerCase())}
							class:incorrect={word !== (playerChoice[index] ? word.toUpperCase() : word.toLowerCase())}>
							{#if playerChoice[index]}
								{words[index].toUpperCase()}
							{:else}{words[index].toLowerCase()}{/if}
						</span>
					{:else}<span class="word">{word}</span>{/if}
				{/each}
			{:else}
				{#each words as word, index}
					{#if choices.has(index)}
						<span
							class="word selectable"
							class:uppercase={playerChoice[index]}
							on:click={() => toggle(index)}>
							{#if playerChoice[index]}
								{words[index].toUpperCase()}
							{:else}{words[index].toLowerCase()}{/if}
						</span>
					{:else}<span class="word">{word}</span>{/if}
				{/each}
			{/if}
		</p>
	</div>

	{#if submitted}
		<h3>You score: {score}%</h3>
	{/if}

	{#if window.twttr}
		<div bind:this={tweetWidget} hidden={!submitted}>
			{#await tweetRendering}
				<p>Loading tweet ...</p>
			{:catch err}
				<p style="color: red; font-weight: bold">Failed to load tweet: {err}</p>
			{/await}
		</div>
	{:else if submitted}
		<p>Cannot load the tweet, Twitter blocked by ad blocker.</p>
	{/if}

	{#if submitted}
		<p>See original <a href="https://twitter.com/realDonaldTrump/status/{tweet.id}" target="_blank">tweet</a>.</p>
	{/if}

	<div class="button">
		{#if !submitted}
			<button on:click={() => verify()}>Verify</button>
		{:else}
			{#await tweetRendering}
				<button disabled={true}>Continue</button>
			{:then _}
				<button on:click={() => cont()}>Continue</button>
			{/await}
		{/if}
	</div>
</div>

<style>
	.tweet {
		font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
		border: 1px solid lightgray;
		border-radius: 14px;
		padding: 20px;
		max-width: 550px;
		box-sizing: border-box;
		margin-bottom: 20px;
	}

	.tweet-header {
		font-weight: bold;
	}

	.tweet-body {
		display: flex;
		flex-wrap: wrap;
		font-size: 1.2em;
	}

	.word {
		margin-right: 5px;
		margin-bottom: 8px;
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
		font-weight: bold;
	}

	.word.correct {
		background-color: lightgreen;
		color: green;
		border-bottom: 2px solid green;
	}

	.word.incorrect {
		background-color: rgb(255, 107, 107);
		color: darkred;
		font-weight: bold;
		border-bottom: 2px solid darkred;
	}

	.button {
		text-align: center;
	}
</style>
