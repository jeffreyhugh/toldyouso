<script lang="ts">
	const { children } = $props();
</script>

<div class="mt-2 w-full lg:hidden">
	<div class="text-base-content/80 ml-1 text-xs lowercase">Advertisement</div>
	<div class="border-base-300 overflow-hidden border">
		{@render children()}
	</div>
</div>
