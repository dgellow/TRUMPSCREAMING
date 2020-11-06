<script lang="ts">
	import { onMount } from "svelte"

	import { tweetsStore } from "./stores"

	onMount(tweetsStore.fetch)
</script>

<pre>
	{#each $tweetsStore as tweet}
		<p>{tweet.text}</p>
	{/each}
</pre>

<style>
</style>
