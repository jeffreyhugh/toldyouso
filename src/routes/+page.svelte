<script lang="ts">
	import { enhance } from "$app/forms";
	import { fail } from "@sveltejs/kit";
	import type { PageProps } from "./$types";
	import { encrypt } from "$lib/crypt";
	import SignInModal from "$lib/SignInModal.svelte";
	import MaxWidthForm from "$lib/MaxWidthForm.svelte";
	import { DateTime } from "luxon";
	import AdBlockSmall from "$lib/AdBlockSmall.svelte";
	import AdBeforeSubmit from "$lib/AdBeforeSubmit.svelte";

	const { data }: PageProps = $props();
	let message = $state("");
	let password = $state("");
	let submitting = $state(false);
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
			const message = formData.get("message");
			if (!message) {
				submitting = false;
				fail(400, {
					message: "this field is required"
				});
				return;
			}

			const password = formData.get("password");
			if (password && !(password instanceof File) && !(message instanceof File)) {
				const cyphertext = await encrypt(message.toString(), password);
				formData.set("message", cyphertext);
				formData.set("encrypted", "true");
			}
			formData.delete("password");

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
			<p class={["label text-sm lowercase", message.length >= 2048 ? "text-error" : ""]}>
				{message.length}/2048 characters
			</p>
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
			By storing a message, you affirm that you have read and agree to the{" "}
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
