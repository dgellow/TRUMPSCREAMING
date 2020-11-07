<script lang="ts">
	import { onMount } from "svelte"

	import { gameStore, tweetsStore } from "./stores"
	import Start from "./components/Start.svelte"
	import Round from "./components/Round.svelte"
	import End from "./components/End.svelte"

	onMount(tweetsStore.fetch)
</script>

<main>
	{#if $gameStore.state === 'not_started'}
		<Start />
	{:else if $gameStore.state === 'round'}
		<Round />
	{:else if $gameStore.state === 'done'}
		<End />
	{/if}
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
