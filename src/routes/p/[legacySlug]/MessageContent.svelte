<script lang="ts">
	import Confetti from 'svelte-confetti';

	const {
		message = '',
		encrypted = false
	}: {
		message: string | null;
		encrypted: boolean | null;
	} = $props();

	let decryptedMessage = $derived(message);
	let key = $state('');
	let err = $state(false);
	let decrypted = $derived(!encrypted);

	const tryKey = async () => {
		try {
			const apiURL = new URL(
				window.location.protocol + '//' + window.location.host + '/api/decrypt'
			);
			apiURL.searchParams.set('data', message || '');
			apiURL.searchParams.set('key', key);
			decryptedMessage = await fetch(apiURL).then((res) => res.text());
			err = false;
			decrypted = true;
		} catch (e) {
			console.error(e);
			err = true;
			return;
		}
	};
</script>

<div class={['bg-base-300 rounded-box w-full px-3 py-1.5', encrypted && !decrypted && 'break-all']}>
	{#if decrypted}
		<div class="hidden w-full justify-center motion-safe:flex">
			<Confetti
				x={[-0.75, 0.75]}
				colorArray={[
					'oklch(59.1% 0.293 322.896)',
					'oklch(59.1% 0.293 322.896)',
					'oklch(55.8% 0.288 302.321)'
				]}
			/>
		</div>
	{/if}
	{decryptedMessage}
</div>
{#if encrypted}
	<form
		class="mt-4 flex w-full flex-col gap-x-4 gap-y-2 md:flex-row md:items-end"
		onsubmit={tryKey}
	>
		<fieldset class="fieldset grow">
			<legend class="fieldset-legend text-sm lowercase"> Message password </legend>
			<input
				bind:value={key}
				type="password"
				class="input w-full focus-within:border-purple-600 focus-within:ring-4 focus-within:ring-fuchsia-600 focus-within:outline-none md:w-auto"
				placeholder="secure-PASSWORD-1"
			/>
			{#if err}
				<p class="label text-error lowercase">Something went wrong -- please try again</p>
			{/if}
		</fieldset>

		<div class="w-full md:w-auto">
			<button
				type="submit"
				class="btn btn-primary w-full bg-linear-to-br from-fuchsia-600 to-purple-600 lowercase md:mb-1"
			>
				🔑 Decrypt
			</button>
			{#if err}
				<div class="invisible mt-px hidden text-base md:block">.</div>
			{/if}
		</div>
	</form>
{/if}
