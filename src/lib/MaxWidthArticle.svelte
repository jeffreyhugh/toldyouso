<script lang="ts">
	const { children } = $props();
</script>

<div class="mx-auto mb-8 flex w-4xl max-w-11/12 flex-col items-stretch gap-4">
	{@render children()}
</div>
