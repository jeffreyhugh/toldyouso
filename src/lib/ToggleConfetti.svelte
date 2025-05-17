<!-- c/o https://github.com/Mitcheljager/svelte-confetti/blob/a0a27505c7b2c4b854fbcb2a6e067d75b96c294e/src/routes/ToggleConfetti.svelte -->

<script>
	import { tick } from 'svelte';

	export let toggleOnce = false;
	export let relative = true;

	let active = false;

	async function click() {
		if (toggleOnce) {
			active = !active;
			return;
		}

		active = false;
		await tick();
		active = true;
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<span on:click={click} class:relative>
	<slot />

	{#if active}
		<div class="confetti">
			<slot name="confetti" />
		</div>
	{/if}
</span>

<style>
	.relative {
		position: relative;
	}

	.relative .confetti {
		position: absolute;
		top: 50%;
		left: 50%;
	}
</style>
