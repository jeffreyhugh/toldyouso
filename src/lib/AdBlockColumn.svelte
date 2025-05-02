<script lang="ts">
	const { children } = $props();
</script>

<div class="mb-8 hidden max-w-1/4 grow overflow-auto px-12 lg:block">
	<div class="text-base-content/80 pl-1 text-xs lowercase">Advertisement</div>
	<div class="border-base-300 overflow-hidden border">
		{@render children()}
	</div>
</div>
