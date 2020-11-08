<script lang="ts">
	import { gameStore } from "../stores"
	$: total = Math.floor($gameStore.scores.reduce((acc, curr) => acc + curr, 0) / $gameStore.scores.length)

	$: adjective = total > 85 ? "a TREMENDOUS" : total > 60 ? "an OK" : "a LOSER"
	$: share = {
		text: encodeURI(`I scored ${adjective.toUpperCase()} ${total}% playing TRUMP SCREAMING! Can you do better?!`),
		url: `https://www.trumpscreaming.site`,
		hashtags: [],
		via: "dgellow",
	}
</script>

<div>
	<h1>Challenge completed!</h1>
	<p class="score">Your final score is <b>{total}%</b>.</p>
	{#if total > 85}
		<p>
			What a
			<b>TREMENDOUS</b>
			performance! You have the Trump vibe going strong in you. Maybe something to be worried about...
		</p>
	{:else if total > 60}
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
			<b>LOSER</b>! We should
			<b>FIRE YOU NOW</b>!!! Better to continue working on your Trumpian screaming skills if you don't want
			<b>CHINA</b>
			to
			<b>STEAL</b>
			your job!
		</p>
	{/if}

	<p class="share">
		Share
		<a
			href="https://twitter.com/intent/tweet?text={share.text}&url={share.url}&hashtags={share.hashtags.join(',')}&via={share.via}"
			target="_blank">your results</a>
		on Twitter.
	</p>

	<div class="button"><button on:click={() => gameStore.next()}>Try again 👹!</button></div>
</div>

<style>
	.score {
		font-size: 2em;
		text-align: center;
		border-bottom: 3px solid orange;
	}

	.share {
		text-align: center;
		font-size: 1.2em;
		font-weight: bold;
	}

	.button {
		text-align: center;
	}
</style>
