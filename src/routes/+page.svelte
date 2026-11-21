<script lang="ts">
	import { DateTime } from 'luxon';

	import { encrypt } from '#lib/crypt.ts';
	import MaxWidthForm from '#lib/MaxWidthForm.svelte';
	import { pb, pbAuth } from '#lib/pb.svelte.ts';
	import type { MessagesRecord } from '#lib/pb.types.ts';
	import SignInModal from '#lib/SignInModal.svelte';
	import { suggestions } from '#lib/suggestedMessages.ts';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let message = $state('');
	let password = $state('');
	let enablePassword = $state(false);
	let submitting = $state(false);
</script>

<svelte:head>
	<title>told-you.so · store a message</title>
</svelte:head>

<MaxWidthForm>
	<form
		onsubmit={async (e) => {
			e.preventDefault();

			const formData = new FormData(e.currentTarget);

			const fdget = (key: string) => formData.get(key)?.toString() ?? '';

			const message = fdget('message');
			const password = fdget('password');
			const dt = fdget('datetime');
			const tz = fdget('timezone');

			const availableAt = DateTime.fromISO(dt, { zone: tz });

			submitting = true;
			const content = password !== '' ? await encrypt(message, password) : message;

			try {
				const rec = await pb.collection('messages').create({
					available: availableAt.toSQL(),
					content,
					encrypted: password !== '',
					owned_by: pbAuth.rec?.id ?? ''
				} as MessagesRecord);

				goto(`/messages/${rec.id}`);
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			} finally {
				submitting = false;
			}
		}}
	>
		<fieldset class="fieldset" disabled={submitting}>
			<legend class="fieldset-legend text-sm lowercase">
				Message
				<span class="text-primary font-bold">*</span>
			</legend>
			<textarea
				name="message"
				class="textarea w-full focus-within:border-purple-600 focus-within:ring-4 focus-within:ring-fuchsia-600 focus-within:outline-none"
				placeholder="Mark my words..."
				required
				maxLength={2048}
				rows={5}
				bind:value={message}></textarea>
			<p class={['label text-sm lowercase', message.length >= 2048 ? 'text-error' : '']}>
				{message.length}/2048 characters
			</p>
		</fieldset>

		<fieldset class="fieldset" disabled={submitting}>
			<legend class="fieldset-legend text-sm lowercase">
				Stuck? Choose a prompt to get started
			</legend>
			<div class="flex w-full flex-wrap gap-2">
				{#each Object.keys(suggestions) as title (title)}
					{@render suggestion(title, suggestions[title].content, suggestions[title].event)}
				{/each}
			</div>
		</fieldset>

		<fieldset class="fieldset flex flex-row items-center justify-between" disabled={submitting}>
			<legend class="fieldset-legend w-full text-sm lowercase">
				(Not required) Use a password to encrypt this message
				<input type="checkbox" bind:checked={enablePassword} class="checkbox" />
			</legend>
		</fieldset>

		{#if enablePassword}
			<fieldset class="fieldset" disabled={submitting}>
				<legend class="fieldset-legend text-sm lowercase">Password to encrypt message</legend>
				<label
					class="input w-full focus-within:border-purple-600 focus-within:ring-4 focus-within:ring-fuchsia-600 focus-within:outline-none"
				>
					<input
						name="password"
						class="grow"
						placeholder="optional-PASSWORD-1"
						type="password"
						autocomplete="new-password"
					/>
					<div class="dropdown dropdown-end dropdown-hover">
						<div
							tabIndex={0}
							role="button"
							class="btn btn-xs btn-circle flex items-center justify-center"
						>
							!
						</div>
						<div
							tabIndex={0}
							class="dropdown-content bg-base-200 rounded-box z-1 mt-2 h-auto w-48 p-2 text-sm text-wrap lowercase shadow-sm"
						>
							If you forget the password, you will not be able to read your message in the future!
						</div>
					</div>
				</label>
			</fieldset>
		{/if}

		<fieldset class="fieldset" disabled={submitting}>
			<legend class="fieldset-legend text-sm lowercase">
				Make my message available at
				<span class="text-primary font-bold">*</span>
			</legend>
			<input
				name="datetime"
				class="input w-full focus-within:border-purple-600 focus-within:ring-4 focus-within:ring-fuchsia-600 focus-within:outline-none"
				type="datetime-local"
				defaultValue={DateTime.now()
					.set({ millisecond: 0, second: 0 })
					.toISO({ includeOffset: false })}
				required
			/>
		</fieldset>

		<input name="timezone" type="hidden" value={Intl.DateTimeFormat().resolvedOptions().timeZone} />

		<div class="mt-4 text-sm font-bold lowercase">
			By storing a message, you affirm that you have read and agree to the
			<a class="link" href={resolve('legal')}>privacy policy and TOS</a>
		</div>

		{#if pbAuth.email == ''}
			<div class="text-warning mt-4 text-sm font-bold lowercase">
				⚠️ You may store this message as a guest, but you will not be able to associate it with your
				account in the future
			</div>
		{/if}

		<button
			type="submit"
			disabled={submitting}
			class="btn btn-primary bg-vibrant mt-4 w-full font-bold lowercase"
			data-umami-event="create message"
			data-umami-event-encrypted={password.length > 0}
		>
			{#if !submitting}
				✏️ Store my message
			{:else}
				⌛ Saving...
			{/if}
		</button>
	</form>
	<SignInModal email={pbAuth.email} />
</MaxWidthForm>

{#snippet suggestion(title: string, content: string, event: string)}
	<button
		data-umami-event="template"
		data-umami-event-template={event}
		class="btn btn-outline border-base-300 btn-xs lowercase"
		type="button"
		onclick={() => {
			if (message.length > 0) {
				const ok = confirm('this will overwrite your existing message -- is that okay?');
				if (!ok) {
					return;
				}
			}
			message = content;
		}}
	>
		{title}
	</button>
{/snippet}
