<script lang="ts">
	import type { text } from "svelte/internal"
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

	$: words = tweet.text.split(/\s/).reduce((acc: string[], curr: string) => {
		if (curr.startsWith("http")) return acc
		const split = curr.split("https")
		if (split.length === 1) {
			acc.push(curr)
			return acc
		}
		curr = ""
		for (const chunk of split) {
			console.log("chunk", chunk)
			if (!chunk.startsWith("://")) curr += chunk
		}
		acc.push(curr)
		return acc
	}, [])

	$: playerChoice = words.map(() => false)

	const toggle = (index: number) => (playerChoice[index] = !playerChoice[index])

	let submitted = false
	let score = 100
	$: results = words.map(() => false)
	const verify = () => {
		submitted = true
		score = 100
		const percentagePerWord = Math.floor(100 / words.length)
		for (let i = 0; i < words.length; i++) {
			const playerWord = playerChoice[i] ? words[i].toUpperCase() : words[i].toLowerCase()
			const ok = words[i] === playerWord
			if (!ok) {
				score -= percentagePerWord
			}
			results[i] = ok
			score = Math.floor(score)
		}
	}

	const cont = () => {
		submitted = false
		gameStore.next()
	}
</script>

<div>
	<h1>Round</h1>
	<p class="tweet">
		{#if submitted}
			{#each words as word, index}
				<span
					class="word"
					class:correct={word === (playerChoice[index] ? word.toUpperCase() : word.toLowerCase())}
					class:incorrect={word !== (playerChoice[index] ? word.toUpperCase() : word.toLowerCase())}
					on:click={() => toggle(index)}>
					{#if playerChoice[index]}{word.toUpperCase()}{:else}{word.toLowerCase()}{/if}
				</span>
			{/each}
		{:else}
			{#each words as word, index}
				<span class="word" class:uppercase={playerChoice[index]} on:click={() => toggle(index)}>
					{#if playerChoice[index]}{word.toUpperCase()}{:else}{word.toLowerCase()}{/if}
				</span>
			{/each}
		{/if}
	</p>
	<p>{round} / {roundNumbers}</p>
	{#if !submitted}
		<button on:click={() => verify()}>Verify</button>
	{:else}
		<p>Score: {score}%</p>
		<button on:click={() => cont()}>Continue</button>
	{/if}
</div>

<style>
	.tweet {
		display: flex;
		flex-wrap: wrap;
		font-size: 1.2em;
	}
	.word {
		margin-right: 5px;
		cursor: pointer;
	}

	.word:hover {
		background-color: lightcoral;
	}

	.word.uppercase {
		background-color: lightpink;
	}

	.word.correct {
		background-color: lightgreen;
	}

	.word.incorrect {
		background-color: red;
	}
</style>
