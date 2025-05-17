<script lang="ts">
	import { onMount } from 'svelte';

	const { id }: { id: string } = $props();

	let mounted = $state(false);
	onMount(() => (mounted = true));

	const share = () => {
		if (
			navigator &&
			navigator.canShare &&
			navigator.canShare({
				url: `https://told-you.so/messages/${id}`
			})
		) {
			navigator.share({ url: `https://told-you.so/messages/${id}` });
		}
	};
</script>

{#if mounted}
	<button
		class={[
			'btn btn-ghost btn-sm lowercase',
			!(
				navigator &&
				navigator.canShare &&
				navigator.canShare({
					url: `https://told-you.so/messages/${id}`
				})
			) && 'hidden'
		]}
		type="button"
		onclick={share}
		data-umami-event="share"
		data-umami-event-from="list"
	>
		↗️ Share
	</button>
{/if}
