<script lang="ts">
	import { PUBLIC_NOADS } from '$env/static/public';
	const { children } = $props();
</script>

{#if !PUBLIC_NOADS}
	<div
		id="ad"
		class="advertisement sponsor mb-8 hidden max-w-1/4 grow overflow-auto px-12 lg:block"
		data-ad="true"
	>
		<div class="text-base-content/80 pl-1 text-xs lowercase">Advertisement</div>
		<div class="border-base-300 overflow-hidden border">
			{@render children()}
		</div>
	</div>
{/if}
