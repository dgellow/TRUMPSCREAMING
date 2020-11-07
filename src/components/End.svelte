<script lang="ts">
	import { gameStore } from "../stores"
	$: total = Math.floor($gameStore.scores.reduce((acc, curr) => acc + curr, 0) / $gameStore.scores.length)

	$: adjective = total > 75 ? "a TREMENDOUS" : total > 50 ? "an OK" : "a LOSER"
	$: share = {
		text: encodeURI(`I scored ${adjective.toUpperCase()} ${total}% playing TRUMP IN CAPS! Can you do better?!`),
		url: `https://`,
		hashtags: [],
		via: "dgellow",
	}
</script>

<div>
	{@debug $gameStore}
	<h1>Challenge completed!</h1>
	<p>Your total score is <b>{total}%</b>.</p>
	{#if total > 75}
		<p>
			What a
			<b>TREMENDOUS</b>
			performance! You have the Trump vibe going strong in you. Surely something to be worried about...
		</p>
	{:else if total > 50}
		<p>
			An
			<b>OK</b>
			performance, but that's not how you will
			<b>MAKE AMERICA GREAT AGAIN</b>! Go back to your training if you don't want to be
			<b>FIRED</b>.
		</p>
	{:else}
		<p>
			What a
			<b>LOSER</b>! I should
			<b>FIRE YOU NOW</b>!!! Better to continue working on your Trumpian screaming skills if you don't want
			<b>CHINA</b>
			to
			<b>STEAL</b>
			your job!
		</p>
	{/if}

	<p>
		Share
		<a
			href="https://twitter.com/intent/tweet?text={share.text}&url={share.url}&hashtags={share.hashtags.join(',')}&via={share.via}">your
			results</a>
		on Twitter.
	</p>

	<button on:click={() => gameStore.next()}>Back to start</button>
</div>
