<script lang="ts">
	import type { Snippet } from 'svelte';

	import AdBoxColumn from './AdBlockColumn.svelte';
	import AdLeftColumn from './AdLeftColumn.svelte';
	import AdRightColumn from './AdRightColumn.svelte';

	const { children, noAds }: { children: Snippet; noAds?: boolean } = $props();
</script>

<div class="flex w-full items-stretch justify-center">
	{#if !noAds}
		<AdBoxColumn>
			<AdLeftColumn />
		</AdBoxColumn>
	{/if}
	<div class="mx-12 mb-8 flex w-11/12 max-w-lg shrink-0 flex-col gap-4 text-lg">
		{@render children()}
	</div>
	{#if !noAds}
		<AdBoxColumn>
			<AdRightColumn />
		</AdBoxColumn>
	{/if}
</div>
