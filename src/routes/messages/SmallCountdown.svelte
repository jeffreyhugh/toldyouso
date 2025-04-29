<script lang="ts">
	import type { DateTime } from "luxon";
	import { onMount } from "svelte";

	const { availableAt }: { availableAt: DateTime } = $props();

	let delta = $state(availableAt.diffNow());
	let deltaObj = $derived(delta.rescale().toObject());

	onMount(() => {
		const interval = setInterval(() => (delta = availableAt.diffNow()), 500);
		return () => clearInterval(interval);
	});

	const shouldShow = (...args: (number | undefined)[]) => {
		let ret = false;
		for (const arg of args) {
			ret ||= (arg ?? -1) >= 0;
		}
		return ret;
	};

	const str = (arg: number | undefined) => (arg || 0).toString();
</script>

<div class="text-vibrant font-bold">
	{#if shouldShow(deltaObj.seconds, deltaObj.minutes, deltaObj.hours, deltaObj.days, deltaObj.months, deltaObj.years)}
		<span>in </span>
	{/if}
	{#if shouldShow(deltaObj.years)}
		<span>{str(deltaObj.years)}y </span>
	{/if}
	{#if shouldShow(deltaObj.months, deltaObj.years)}
		<span>{str(deltaObj.months)}mo </span>
	{/if}
	{#if shouldShow(deltaObj.days, deltaObj.months, deltaObj.years)}
		<span>{str(deltaObj.days)}d </span>
	{/if}
	{#if shouldShow(deltaObj.hours, deltaObj.days, deltaObj.months, deltaObj.years)}
		<span>{str(deltaObj.hours).padStart(2, "0")}h </span>
	{/if}
	{#if shouldShow(deltaObj.minutes, deltaObj.hours, deltaObj.days, deltaObj.months, deltaObj.years)}
		<span>{str(deltaObj.minutes).padStart(2, "0")}m </span>
	{/if}
	{#if shouldShow(deltaObj.seconds, deltaObj.minutes, deltaObj.hours, deltaObj.days, deltaObj.months, deltaObj.years)}
		<span>{str(deltaObj.seconds).padStart(2, "0")}s </span>
	{:else}
		<span>{availableAt.toRelative()}</span>
	{/if}
</div>
