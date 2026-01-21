<script lang="ts">
	import { DateTime } from 'luxon';

	import { resolve } from '$app/paths';
	import MaxWidthForm from '$lib/MaxWidthForm.svelte';
	import SignInModal from '$lib/SignInModal.svelte';

	import CopyButton from './CopyButton.svelte';
	import ShareButton from './ShareButton.svelte';
	import SmallCountdown from './SmallCountdown.svelte';

	type Row_t = {
		available_at: DateTime<true>;
		content: string | null;
		created_at: DateTime<true>;
		encrypted: boolean | null;
		id: string | null;
		legacy_slug: string | null;
		owned_by: string | null;
		sha256: string | null;
	};

	const { data } = $props();

	const IDX = {
		AVAILABLE: 0,
		UPCOMING: 1
	};

	const [available, upcoming] = $derived(
		// prettier-ignore
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(data.rows.map((row: any) => ({
				...row,
				created_at: DateTime.fromISO(row.created_at || '') as DateTime<true>,
				available_at: DateTime.fromISO(row.available_at || '') as DateTime<true>
			})) as Row_t[]).reduce(
			(prev, row) => {
				const ret = [[...prev[IDX.AVAILABLE]], [...prev[IDX.UPCOMING]]];
				if (row.available_at.diffNow().as('milliseconds') < 0) {
					ret[IDX.AVAILABLE].unshift(row);
				} else {
					ret[IDX.UPCOMING].push(row);
				}

				return ret;
			},
			[[], []] as Row_t[][]
		)
	);
</script>

<svelte:head>
	<title>told-you.so · my messages</title>
</svelte:head>

<MaxWidthForm>
	{#if upcoming.length === 0 && available.length === 0}
		<div class="flex w-full flex-col items-center lowercase">
			<div>😦 No messages to display</div>
			<div class="mt-4 flex justify-center gap-4">
				<a href={resolve('/')} class="btn btn-primary bg-vibrant font-bold lowercase">
					🔮 Save a message
				</a>
				<div class="w-auto"><SignInModal email={data.user?.email} /></div>
			</div>
		</div>
	{:else}
		<SignInModal email={data.user?.email} />

		<div class="divider my-2 lowercase">Upcoming</div>
		{#each upcoming as row (row.id)}
			{@render messageCard(row)}
		{/each}

		<div class="divider mt-6 mb-2 lowercase">Available</div>
		{#each available as row (row.id)}
			{@render messageCard(row)}
		{/each}
	{/if}
</MaxWidthForm>

{#snippet messageCard(row: Row_t)}
	<div class="bg-base-200 rounded-box flex flex-col gap-2 p-4">
		<div class="flex justify-between">
			<div class="flex flex-col">
				<div class="text-sm font-bold lowercase">Created</div>
				<div class="lowercase">{row.created_at.toRelative()}</div>
			</div>
			<div class="flex flex-col items-end">
				<div class="text-sm font-bold lowercase">Available</div>
				<div class="lowercase"><SmallCountdown availableAt={row.available_at} /></div>
			</div>
		</div>
		<div class="flex items-center justify-between">
			<div class="text-xs lowercase">
				{#if row.encrypted}
					🔓 Encrypted
				{/if}
			</div>
			<div class="flex justify-end gap-2">
				<ShareButton id={row.id || ''} />
				<CopyButton id={row.id || ''} />
				<a
					class={[
						'btn btn-sm font-bold lowercase',
						row.available_at.diffNow().as('milliseconds') < 0
							? 'btn-primary bg-vibrant'
							: 'btn-ghost'
					]}
					href={resolve(`/messages/${row.id}`)}
				>
					💨 Go to message
				</a>
			</div>
		</div>
	</div>
{/snippet}
