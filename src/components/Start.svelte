<script lang="ts">
	import { gameStore } from "../stores"
</script>

<div>
	<h1>The <span class="upper">TRUMP SCREAMING</span> game</h1>
	<p>
		Rules are simple: can you guess correctly what parts of Trump tweets are in
		<span class="upper">ALL CAPS</span>
		and supposed to be
		<span class="upper">SCREAMED OUT LOUD</span>?
	</p>
	<p>
		You will be presented 10 tweets in a row, in lowercase. Select the underlined words to toggle their case, then
		check your score!
	</p>
	<div class="button"><button on:click={() => gameStore.next()}>Let's start!🦅</button></div>
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
