<script lang="ts">
	import Confetti from 'svelte-confetti';

	import { confettiArray } from '$lib/confettiArray';
	import { gtag } from '$lib/gtag';
	import ToggleConfetti from '$lib/ToggleConfetti.svelte';

	const { id }: { id: string } = $props();

	let copied = $state(false);

	const copyLink = async () => {
		copied = true;
		const timeout = setTimeout(() => (copied = false), 3000);
		await navigator.clipboard.writeText(`https://told-you.so/messages/${id}`);

		return () => clearTimeout(timeout);
	};
</script>

<ToggleConfetti>
	<button
		class="btn btn-ghost btn-sm lowercase"
		type="button"
		onclick={() => {
			gtag('event', 'copy link', { from: 'list' });
			copyLink();
		}}
		data-umami-event="copy link"
		data-umami-event-from="list"
	>
		{#if !copied}
			🔗 Copy link
		{:else}
			🎉 Copied!
		{/if}
	</button>
	<div slot="confetti" class="hidden w-full justify-center motion-safe:flex">
		<Confetti colorArray={confettiArray} />
	</div>
</ToggleConfetti>
