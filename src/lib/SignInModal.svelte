<script lang="ts">
	import { enhance } from "$app/forms";

	const { email }: { email: string | undefined } = $props();

	let dialogElement = $state<HTMLDialogElement | null>(null);

	let submitting = $state(false);
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
	<div class="modal-box">
		<h2 class="text-xl font-bold lowercase">Sign In</h2>
		<div class="text-sm lowercase">Don't have an account? Enter your email to create one.</div>
		<div class="mt-2">
			<form
				method="post"
				action="?/signin"
				use:enhance={async () => {
					submitting = true;

					return async ({ update }) => {
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

				<button
					disabled={submitting}
					type="submit"
					class="btn btn-primary bg-vibrant mt-2 w-full font-bold lowercase"
				>
					📨 send me a link
				</button>
			</form>
		</div>
	</div>

	<form method="dialog" class="modal-backdrop">
		<button>Close</button>
	</form>
</dialog>
