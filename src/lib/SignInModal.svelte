<script lang="ts">
	import { enhance } from "$app/forms";
	import Confetti from "svelte-confetti";
	import { confettiArray } from "./confettiArray";

	const { email }: { email: string | undefined } = $props();

	let dialogElement = $state<HTMLDialogElement | null>(null);

	let submitting = $state(false);
	let success = $state(false);
</script>

<button
	type="button"
	class="btn btn-outline w-full font-bold lowercase"
	onclick={() => dialogElement?.showModal()}
>
	{#if email}
		Signed in as {email}
	{:else}
		🔐 Sign in
	{/if}
</button>
<dialog bind:this={dialogElement} class="modal">
	<div class="modal-box overflow-hidden">
		{#if !email}
			<h2 class="text-xl font-bold lowercase">Sign In</h2>
			<div class="text-sm lowercase">Don't have an account? Enter your email to create one.</div>
			<div class="mt-2">
				<form
					method="post"
					action="?/signin"
					use:enhance={async () => {
						success = false;
						submitting = true;

						return async ({ update, result }) => {
							if (result.status === 200) {
								success = true;
							}
							submitting = false;
							update();
						};
					}}
				>
					<fieldset class="fieldset" disabled={submitting}>
						<legend class="fieldset-legend text-sm lowercase">Email</legend>
						<input
							required
							name="email"
							class="input w-full focus-within:border-purple-600 focus-within:ring-4 focus-within:ring-fuchsia-600 focus-within:outline-none"
							type="email"
							placeholder="future.eyeball.wizard@magic.tld"
							inputmode="email"
						/>
					</fieldset>

					{#if !success}
						<button
							disabled={submitting || success}
							type="submit"
							class="btn btn-primary bg-vibrant mt-2 w-full font-bold lowercase"
							data-umami-event="sign in"
						>
							📨 Send me a link
						</button>
						<text class="text-xs lowercase">
							Used for authentication only -- no mailing lists, no marketing, no reselling
						</text>
					{/if}
				</form>
				{#if success}
					<div class="mt-2 flex w-full flex-col items-stretch">
						<div class="btn btn-primary bg-vibrant font-bold lowercase">
							🎉 Success! Please check your email
						</div>
						<div class="flex w-full justify-center">
							<Confetti colorArray={confettiArray} />
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<h2 class="text-xl font-bold lowercase">Signed in</h2>
			<div class="text-sm lowercase">as {email}</div>
			<div class="mt-2">
				<form
					method="post"
					action="?/signout"
					use:enhance={async () => {
						submitting = true;

						return async ({ update }) => {
							submitting = false;
							update();
						};
					}}
				>
					<button
						disabled={submitting}
						type="submit"
						class="btn btn-primary bg-vibrant mt-2 w-full font-bold lowercase"
						data-umami-event="sign out"
					>
						👋 Sign out
					</button>
				</form>
			</div>
		{/if}
	</div>

	<form method="dialog" class="modal-backdrop">
		<button>Close</button>
	</form>
</dialog>
