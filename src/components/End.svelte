<script lang="ts">
	import { gameStore } from "../stores"
</script>

<div>
	<h1>End</h1>
	<button on:click={() => gameStore.next()}>Back to start</button>
</div>
