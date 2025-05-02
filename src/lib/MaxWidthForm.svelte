<script lang="ts">
	import AdBoxColumn from "./AdBlockColumn.svelte";
	import AdLeftColumn from "./AdLeftColumn.svelte";
	import AdRightColumn from "./AdRightColumn.svelte";

	const { children } = $props();
</script>

<div class="flex w-full items-stretch justify-center">
	<AdBoxColumn>
		<AdLeftColumn />
	</AdBoxColumn>
	<div class="mx-12 mb-8 flex w-11/12 max-w-lg shrink-0 flex-col gap-4 text-lg">
		{@render children()}
	</div>
	<AdBoxColumn>
		<AdRightColumn />
	</AdBoxColumn>
</div>
