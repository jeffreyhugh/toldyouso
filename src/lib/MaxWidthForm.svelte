<script lang="ts">
	const { children } = $props();
</script>

<div class="mx-auto mb-8 flex w-11/12 max-w-lg flex-col gap-4 text-lg">
	{@render children()}
</div>
