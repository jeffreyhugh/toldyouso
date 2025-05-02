<script lang="ts">
	const { children } = $props();
</script>

<div id="ad" class="advertisement sponsor mt-2 w-full lg:hidden" data-ad="true">
	<div class="text-base-content/80 ml-1 text-xs lowercase">Advertisement</div>
	<div class="border-base-300 overflow-hidden border">
		{@render children()}
	</div>
</div>
