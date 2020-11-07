<script lang="ts">
	import { gameStore } from "../stores"
</script>

<div>
	<h1>The TRUMP SCREAMING Game</h1>
	<p>
		Hey, you, are you a
		<span class="upper">LOSER</span>
		or
		<span class="upper">A FRAUD</span>?! Listen closely to the
		<span class="upper">TRUMP SPIRIT</span>
		within
		<span class="upper">YOU</span>
		and ask yourself: Do you think you guess
		<span class="upper">CORRECTLY</span>
		when Trump is
		<span class="upper">SCREAMING</span>
		out loud when
		<span class="upper">TWEETING</span>?!
	</p>
	<div class="button"><button on:click={() => gameStore.next()}>For sure, let's start!🦅</button></div>
	<p class="no-cheater center"><span class="upper">NOT FOR CHEATERS</span></p>
</div>

<style>
	p {
		margin-top: 60px;
		margin-bottom: 60px;
	}
	.button {
		text-align: center;
	}

	.center {
		text-align: center;
	}

	.upper {
		font-weight: bold;
		border-bottom: 2px solid orange;
	}

	.no-cheater .upper {
		background-color: rgb(250, 129, 129);
		border-color: darkred;
		padding-left: 10px;
		padding-right: 10px;
	}
</style>
