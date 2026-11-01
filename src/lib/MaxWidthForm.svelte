<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();
</script>

<div class="flex w-full items-stretch justify-center">
	<div class="mx-12 mb-8 flex w-11/12 max-w-lg shrink-0 flex-col gap-4 text-lg">
		{@render children()}
	</div>
</div>
