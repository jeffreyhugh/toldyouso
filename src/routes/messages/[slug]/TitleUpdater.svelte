<script lang="ts">
	import { DateTime } from 'luxon';

	import { useNow } from '#lib/useNow.svelte.ts';

	const { availableAt }: { availableAt: DateTime<true> } = $props();

	const now = useNow();

	const transformForTitle = (now: DateTime<true>, availableAt: DateTime<true>) =>
		availableAt.diffNow().as('milliseconds') < 0
			? 'available now'
			: availableAt
					.diff(now)
					.rescale()
					.set({ milliseconds: 0 })
					.toFormat('y M d h m s')
					.split(' ')
					.map((s, i) => ({ num: Number(s), unit: ['y', 'mo', 'd', 'h', 'm', 's'][i] }))
					.filter((item) => item.num)
					.map(
						(item) =>
							`${item.num.toString().padStart(item.unit === 'h' || item.unit === 'm' || item.unit === 's' ? 2 : 1, '0')}${item.unit}`
					)
					.join(' ');

	let titleAvailableAt = $derived(transformForTitle(now(), availableAt));
</script>

<svelte:head>
	<title>told-you.so · {titleAvailableAt}</title>
</svelte:head>
