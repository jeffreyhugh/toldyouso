<script lang="ts">
	import { PUBLIC_NOADS } from '$env/static/public';
	const { children } = $props();

	let clientWidth = $state(0);
</script>

{#if PUBLIC_NOADS !== 'true'}
	<div
		id="ad"
		class="advertisement sponsor mb-8 hidden max-w-1/4 grow overflow-auto px-12 select-none lg:block"
		data-ad="true"
	>
		<div class="text-base-content/80 pl-1 text-xs lowercase">Advertisement</div>
		<div
			class="border-base-300 flex items-center justify-center overflow-hidden border"
			bind:clientWidth
		>
			{#if clientWidth >= 120}
				{@render children()}
			{/if}
		</div>
	</div>
{/if}
