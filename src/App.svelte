<script lang="ts">
	import { onMount } from "svelte"

	import { tweetsStore } from "./stores"

	onMount(tweetsStore.fetch)
</script>

<main>
	<h2>{$tweetsStore.length} tweets capitalized</h2>
	{#each $tweetsStore as tweet}
		<p>{tweet.text}</p>
	{/each}
</main>

<style>
	main {
		width: 700px;
		margin: auto;
	}

	p {
		margin-bottom: 40px;
	}
</style>
