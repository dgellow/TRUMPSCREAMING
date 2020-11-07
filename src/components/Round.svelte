<script lang="ts">
	import { gameStore, roundNumbers } from "../stores"
	let round = 0
	$: {
		const game = $gameStore
		round = game.state === "round" ? game.roundNumber : -1
	}
</script>

<div>
	<h1>Round</h1><button on:click={() => gameStore.next()}>Next</button>
	<p>{round} / {roundNumbers}</p>
</div>
