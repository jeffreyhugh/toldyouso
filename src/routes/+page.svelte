<script lang="ts">
	import { fail } from '@sveltejs/kit';
	import { DateTime } from 'luxon';
	import outdent from 'outdent';

	import { enhance } from '$app/forms';
	import AdBeforeSubmit from '$lib/AdBeforeSubmit.svelte';
	import AdBlockSmall from '$lib/AdBlockSmall.svelte';
	import { encrypt } from '$lib/crypt';
	import MaxWidthForm from '$lib/MaxWidthForm.svelte';
	import SignInModal from '$lib/SignInModal.svelte';

	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	let message = $state('');
	let password = $state('');
	let submitting = $state(false);

	const suggestions: Record<string, { event: string; content: string }> = {
		'🧑📸 Life Snapshot': {
			event: 'life-snapshot',
			content: outdent`
				Dear Future Me,

				I hope everything is going well in the future! It is currently ${DateTime.now().toLocaleString(DateTime.DATE_MED)}, and right now, I'm <...>

				Here's three things I'm super proud of:
				1. <...(something academic/professional)>
				2. <...(something extracirricular)>
				3. <...(something interpersonal)>

				And here's one thing I hope to accomplish in the next five years:
				1. <...>

				Keep up the good work!

				Best,
				Past You
			`
		},
		'🤫❤️ Future Romantic Interest': {
			event: 'romantic-interest',
			content: outdent`
				Heyyy,

				It's ${DateTime.now().toLocaleString(DateTime.DATE_MED)}, and:
				- We're currently <...(besties, strangers, talking, dating)>
				- My embarassing secret: <...>
				- I hope when you read this, we're <...(still friends, together)>

				Xoxo,
				<...>

				P.S. Do we still talk? If not, why?
			`
		},
		'💃🎤 Pop Culture ': {
			event: 'pop-culture',
			content: outdent`
				Right now (${DateTime.now().toLocaleString(DateTime.DATE_MED)}), everyone's obsessed with:
				- Movie: <...(title, studio, actor)>
				- Viral Trend: <...(TikTok dance, meme)>
				- Music: <...(song, artist)>

				My predictions for when this is read:
				1. <...> flopped hard
				2. <...> became a classic
				3. We still don't have flying cars, do we?
			`
		},
		'😬😅 Embarassing Dare': {
			event: 'embarassing-dare',
			content: outdent`
				Future Brave Me,

				You MUST do this within 24 hour of reading:
				<...(try food you don't like, ask someone out, dance in public)>

				Rules:
				1. No backing out!
				2. Evidence required (screenshot/video)
				3. Send the evidence to your best friend

				No regrets,
				Chaotic Past You
			`
		},
		'🙏💯 Gratitude Moment': {
			event: 'gratitude-moment',
			content: outdent`
			Here are three things I'm grateful for:
			1. <...>
			2. <...>
			3. <...>
			`
		}
	};
</script>

<svelte:head>
	<title>told-you.so · store a message</title>
</svelte:head>

<MaxWidthForm>
	<form
		method="POST"
		action="?/createMessage"
		use:enhance={async ({ formData }) => {
			submitting = true;
			const message = formData.get('message');
			if (!message) {
				submitting = false;
				fail(400, {
					message: 'this field is required'
				});
				return;
			}

			const password = formData.get('password');
			if (password && !(password instanceof File) && !(message instanceof File)) {
				const cyphertext = await encrypt(message.toString(), password);
				formData.set('message', cyphertext);
				formData.set('encrypted', 'true');
			}
			formData.delete('password');

			return async ({ update }) => {
				submitting = false;
				update();
			};
		}}
	>
		<fieldset class="fieldset" disabled={submitting}>
			<legend class="fieldset-legend text-sm lowercase">
				Message<span class="text-primary font-bold">*</span>
			</legend>
			<textarea
				name="message"
				class="textarea w-full focus-within:border-purple-600 focus-within:ring-4 focus-within:ring-fuchsia-600 focus-within:outline-none"
				placeholder="Mark my words..."
				required
				maxLength={2048}
				rows={5}
				bind:value={message}
			></textarea>
			<p class={['label text-sm lowercase', message.length >= 2048 ? 'text-error' : '']}>
				{message.length}/2048 characters
			</p>
		</fieldset>

		<fieldset class="fieldset" disabled={submitting}>
			<legend class="fieldset-legend text-sm lowercase"
				>Stuck? Choose a prompt to get started</legend
			>
			<div class="flex w-full flex-wrap gap-2">
				{#each Object.keys(suggestions) as title (title)}
					{@render suggestion(title, suggestions[title].content, suggestions[title].event)}
				{/each}
			</div>
		</fieldset>

		<fieldset class="fieldset" disabled={submitting}>
			<legend class="fieldset-legend text-sm lowercase">
				Optional password to encrypt message
			</legend>
			<label
				class="input w-full focus-within:border-purple-600 focus-within:ring-4 focus-within:ring-fuchsia-600 focus-within:outline-none"
			>
				<input
					bind:value={password}
					name="password"
					class="grow"
					placeholder="optional-PASSWORD-1"
					type="password"
				/>
				<div class="dropdown dropdown-end dropdown-hover">
					<div
						tabIndex={0}
						role="button"
						class="btn btn-xs btn-circle flex items-center justify-center"
					>
						?
					</div>
					<div
						tabIndex={0}
						class="dropdown-content bg-base-200 rounded-box z-1 mt-2 h-auto w-48 p-2 text-sm text-wrap lowercase shadow-sm"
					>
						If you set a password, your message will be encrypted client-side with AES-256
					</div>
				</div>
			</label>
		</fieldset>

		<fieldset class="fieldset" disabled={submitting}>
			<legend class="fieldset-legend text-sm lowercase">
				Make my message available at<span class="text-primary font-bold">*</span>
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
			<a class="link" href="/legal"> privacy policy and tos </a>
		</div>

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
	<SignInModal email={data.user?.email} />

	<AdBlockSmall>
		<AdBeforeSubmit />
	</AdBlockSmall>
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
