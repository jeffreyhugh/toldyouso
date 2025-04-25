<script lang="ts">
	import { decrypt } from "$lib/crypt";
	import Confetti from "svelte-confetti";

	const {
		message = "",
		encrypted = false
	}: {
		message: string | null;
		encrypted: boolean | null;
	} = $props();

	let decryptedMessage = $state(message);
	let key = $state("");
	let invalidKey = $state(false);
	let decrypted = $state(!encrypted);

	const tryKey = async () => {
		try {
			decryptedMessage = await decrypt(message || "", key);
			invalidKey = false;
			decrypted = true;
		} catch {
			invalidKey = true;
			return;
		}
	};
</script>

<div class={["bg-base-300 rounded-box w-full px-3 py-1.5", encrypted && !decrypted && "break-all"]}>
	{#if decrypted}
		<div class="hidden w-full justify-center motion-safe:flex">
			<Confetti
				x={[-0.75, 0.75]}
				colorArray={[
					"oklch(59.1% 0.293 322.896)",
					"oklch(59.1% 0.293 322.896)",
					"oklch(55.8% 0.288 302.321)"
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
			{#if invalidKey}
				<p class="label text-error lowercase">Invalid password</p>
			{/if}
		</fieldset>

		<div class="w-full md:w-auto">
			<button
				type="submit"
				class="btn btn-primary w-full bg-gradient-to-br from-fuchsia-600 to-purple-600 lowercase md:mb-1"
			>
				🔑 Decrypt
			</button>
			{#if invalidKey}
				<div class="invisible mt-px hidden text-base md:block">{"."}</div>
			{/if}
		</div>
	</form>
{/if}
