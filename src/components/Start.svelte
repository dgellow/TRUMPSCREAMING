<script lang="ts">
	import { gameStore, roundNumbers, tweetsStore } from "../stores"

	export let loading: boolean
</script>

<div>
	<h1>The <span class="upper">TRUMP SCREAMING</span> game</h1>
	<p>
		Rules are simple: can you guess correctly what parts of Trump tweets are in
		<span class="upper">ALL CAPS</span>
		and supposed to be
		<span class="upper">SCREAMED OUT LOUD</span>?
	</p>
	{#if loading}
		<p>Loading data...</p>
		<div class="button"><button disabled>Getting ready...</button></div>
	{:else}
		<p>
			You will be presented
			{roundNumbers}
			tweets in a row (from a curated collection of
			{$tweetsStore.length}
			Trump tweets), in lowercase. Select the underlined words to toggle their case, then check your score!
		</p>
		<div class="button"><button on:click={() => gameStore.next()}>Let's start!🦅</button></div>
	{/if}
</div>

<style>
	p {
		margin-top: 60px;
		margin-bottom: 60px;
	}
	.button {
		text-align: center;
	}

	.upper {
		font-weight: bold;
		border-bottom: 2px solid orange;
	}
</style>
