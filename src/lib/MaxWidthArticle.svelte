<script lang="ts">
	const { children } = $props();
</script>

<div class="mx-auto mb-8 flex w-11/12 max-w-[47.5rem] shrink-0 flex-col items-stretch gap-4">
	{@render children()}
</div>
