<script lang="ts">
	import { gameStore } from "../stores"
</script>

<div>
	<h1>Start</h1>
	<button on:click={() => gameStore.next()}>Start</button>
</div>
