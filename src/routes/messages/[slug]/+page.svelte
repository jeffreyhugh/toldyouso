<script lang="ts">
	import { DateTime } from 'luxon';
	import { ClientResponseError } from 'pocketbase';

	import MaxWidthForm from '#lib/MaxWidthForm.svelte';
	import { type Message_t, pb } from '#lib/pb.svelte.ts';
	import { goto } from '$app/navigation';

	import type { PageProps } from './$types';
	import CountdownTimer from './CountdownTimer.svelte';
	import MessageContent from './MessageContent.svelte';
	import TitleUpdater from './TitleUpdater.svelte';

	const { params }: PageProps = $props();

	const messagePromise = (async (): Promise<Message_t> => {
		// try {
		// 	return await pb.collection('messages').getOne<Message_t>(params.slug);
		// } catch (err) {
		// 	if (err instanceof ClientResponseError && err.status === 404) {
		// 		console.error('NO V3 ID');
		// 	} else {
		// 		// eslint-disable-next-line no-console
		// 		console.error(err);
		// 	}
		// }

		// could not find by new ID; check v2 ID next
		try {
			const res = await pb.collection('messages').getFirstListItem<Message_t>(
				pb.filter('id = {:slug} || legacy_v2_id = {:slug} || legacy_v1_slug = {:slug}', {
					slug: params.slug
				})
			);
			if (res.id !== params.slug) {
				goto(`/messages/${res.id}`, {
					state: {
						fetchedMessage: res
					},
					replace: true
				});
			}
			return res;
		} catch (err) {
			if (err instanceof ClientResponseError && err.status === 404) {
				return Promise.reject('not found');
			} else {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		}

		// check for v1
		// try {
		// 	const res = await pb
		// 		.collection('messages')
		// 		.getFirstListItem<Message_t>(pb.filter('legacy_v1_slug = {:v1}', { v1: params.slug }));
		// 	goto(`/messages/${res.id}`, {
		// 		state: {
		// 			fetchedMessage: res
		// 		},
		// 		replace: true
		// 	});
		// } catch (err) {
		// 	if (err instanceof ClientResponseError && err.status === 404) {
		// 		return Promise.reject('not found');
		// 	} else {
		// 		// eslint-disable-next-line no-console
		// 		console.error(err);
		// 	}
		// }

		return Promise.reject('not found');
	})();

	const parseSQLTime = (str: string) => {
		const t = DateTime.fromSQL(str);
		if (!t.isValid) {
			return DateTime.now();
		}
		return t;
	};
</script>

<MaxWidthForm>
	{#await messagePromise}
		<div class="text-center">Loading ⌛</div>
	{:then message}
		{const createdAt = $derived(parseSQLTime(message.created))}
		{const availableAt = $derived(parseSQLTime(message.available))}

		<TitleUpdater {availableAt} />

		{#if availableAt.diffNow().as('seconds') >= 0}
			<CountdownTimer id={message.id || ''} {availableAt} />
		{:else}
			<MessageContent
				message={message.content}
				encrypted={message.encrypted === true}
				isV1={Boolean(message.legacy_v1_slug)}
			/>
		{/if}
		<div class="mt-8 flex w-full justify-center text-sm lowercase opacity-85">
			<table>
				<tbody>
					<tr>
						<td class="pr-1 text-right">Submitted</td>
						<td>
							{createdAt.toRelative()} on {createdAt.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}
							<wbr />
							at {createdAt.toLocaleString(DateTime.TIME_SIMPLE)}
						</td>
					</tr>

					<tr>
						<td class="pr-1 text-right">Available</td>
						<td>
							{availableAt.toRelative()} on {availableAt.toLocaleString(
								DateTime.DATE_MED_WITH_WEEKDAY
							)}
							<wbr />
							at {availableAt.toLocaleString(DateTime.TIME_SIMPLE)}
						</td>
					</tr>

					<tr>
						<td class="pr-1 text-right">SHA256</td>
						<td>
							<div class="bg-base-200 rounded-box w-min px-1 py-0.5">
								<code class="leading-none select-all">
									{message.sha256.substring(0, 32)}
									<wbr />
									{message.sha256?.substring(32)}
								</code>
							</div>
						</td>
					</tr>

					{#if message.encrypted}
						<tr>
							<td class="pr-1">Encrypted</td>
							<td>🔒</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	{:catch}
		<div class="flex flex-col items-center gap-2 lowercase">
			<h1 class="text-2xl font-bold md:text-4xl">error 404</h1>
			<div>
				We couldn&apos;t find that message -- want to <a class="link" href="/">make a new one?</a>
			</div>
		</div>
	{/await}
</MaxWidthForm>
