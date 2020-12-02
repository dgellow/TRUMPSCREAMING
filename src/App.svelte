<script lang="ts">
	import { onMount } from "svelte"

	import { gameStore, tweetsStore } from "./stores"
	import Start from "./components/Start.svelte"
	import Round from "./components/Round.svelte"
	import End from "./components/End.svelte"

	let loading = true

	onMount(async () => {
		loading = true
		await tweetsStore.fetch()
		loading = false
	})
</script>

<main>
	{#if $gameStore.state === 'not_started'}
		<Start {loading} />
	{:else if $gameStore.state === 'round'}
		<Round />
	{:else if $gameStore.state === 'done'}
		<End />
	{/if}
	<footer>
		A weekend project by
		<a href="https://twitter.com/dgellow" target="_blank">@dgellow</a>, made with
		<a href="https://svelte.dev/" target="_blank">Svelte</a>. Check out the
		<a href="https://github.com/dgellow/TRUMPSCREAMING" target="_blank">sources</a>.
	</footer>
</main>

<style>
	main {
		margin: auto;
		box-sizing: border-box;
		min-height: 600px;
		max-width: 550px;
		position: relative;
		padding-top: 40px;
		padding-bottom: 200px;
	}

	footer {
		color: rgb(218, 218, 218);
		position: absolute;
		bottom: 0;
		text-align: center;
		width: 100%;
	}
</style>
