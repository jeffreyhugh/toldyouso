<script lang="ts">
	import type { DateTime } from 'luxon';
	import { onMount } from 'svelte';
	import Confetti from 'svelte-confetti';

	import { gtag } from '$lib/gtag';
	import ToggleConfetti from '$lib/ToggleConfetti.svelte';

	const { id, availableAt }: { id: string; availableAt: DateTime } = $props();
	let copied = $state(false);
	let mounted = $state(false);
	onMount(() => (mounted = true));

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

	const copyLink = async () => {
		copied = true;
		const timeout = setTimeout(() => (copied = false), 3000);
		await navigator.clipboard.writeText(window.location.href);

		return () => clearTimeout(timeout);
	};

	const share = () => {
		if (
			navigator &&
			navigator.canShare &&
			navigator.canShare({
				url: `https://told-you.so/messages/${id}`
			})
		) {
			navigator.share({ url: `https://told-you.so/messages/${id}` });
		}
	};
</script>

<div class="text-center text-2xl lowercase select-none">
	{#if delta.as('seconds') >= 0}
		Message available in
		<div class="text-vibrant text-4xl font-bold">
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
				<span>{str(deltaObj.hours).padStart(2, '0')}h </span>
			{/if}
			{#if shouldShow(deltaObj.minutes, deltaObj.hours, deltaObj.days, deltaObj.months, deltaObj.years)}
				<span>{str(deltaObj.minutes).padStart(2, '0')}m </span>
			{/if}
			{#if shouldShow(deltaObj.seconds, deltaObj.minutes, deltaObj.hours, deltaObj.days, deltaObj.months, deltaObj.years)}
				<span>{str(deltaObj.seconds).padStart(2, '0')}s </span>
			{:else}
				<span>00s</span>
			{/if}
		</div>
		<ToggleConfetti>
			<button
				type="button"
				onclick={() => {
					gtag('event', 'copy link', { from: 'message' });
					copyLink();
				}}
				class="btn btn-primary bg-vibrant btn-wide mt-8 font-bold lowercase"
				data-umami-event="copy link"
				data-umami-event-from="message"
			>
				{#if !copied}
					🔗 Copy message link
				{:else}
					🎉 Copied!
				{/if}
			</button>
			<Confetti
				x={[-0.75, 0.75]}
				slot="confetti"
				colorArray={[
					'oklch(59.1% 0.293 322.896)',
					'oklch(59.1% 0.293 322.896)',
					'oklch(55.8% 0.288 302.321)'
				]}
			/>
		</ToggleConfetti>
		{#if mounted}
			<button
				type="button"
				onclick={() => {
					gtag('event', 'share', { from: 'message' });
					share();
				}}
				class={[
					'btn btn-outline btn-wide mt-2 font-bold lowercase',
					!(
						navigator &&
						navigator.canShare &&
						navigator.canShare({
							url: `https://told-you.so/messages/${id}`
						})
					) && 'hidden'
				]}
				data-umami-event="share"
				data-umami-event-from="message"
			>
				↗️ Share
			</button>
		{/if}
	{:else}
		<div
			class="pointer-events-none fixed -top-12 left-0 hidden h-dvh w-dvw justify-center overflow-hidden motion-safe:flex"
		>
			<Confetti
				x={[-5, 5]}
				y={[0, 0.1]}
				infinite
				colorArray={[
					'oklch(59.1% 0.293 322.896)',
					'oklch(59.1% 0.293 322.896)',
					'oklch(55.8% 0.288 302.321)'
				]}
				delay={[500, 2000]}
				duration={5000}
				amount={200}
				fallDistance="100dvh"
			/>
		</div>
		Message available now
		<a
			data-sveltekit-reload
			href={window.location.href}
			class="btn btn-wide btn-primary mt-4 bg-gradient-to-br from-fuchsia-600 to-purple-600 lowercase"
		>
			🎉 Refresh
		</a>
	{/if}
</div>
