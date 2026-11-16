<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/quicksand';

	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';

	import { detectAdblock } from '#lib/detectAdblock.js';

	// import { page } from '$app/state';
	import Header from './Header.svelte';

	let { children } = $props();
	// let { session, supabase } = $derived(data);
	// onMount(() => {
	// 	const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
	// 		if (newSession?.expires_at !== session?.expires_at) {
	// 			invalidate('supabase:auth');
	// 		}
	// 	});
	// 	return () => data.subscription.unsubscribe();
	// });

	onMount(async () => {
		const adblock = await detectAdblock();
		umami.identify({
			adblock,
			noAdblock: adblock ? undefined : true,
			yesAdblock: adblock ? true : undefined
		});
	});

	// $effect(() => {
	// 	console.log(page.url.pathname);
	// 	if (page.url.pathname.startsWith('/blog')) {
	// 		localStorage.setItem('visitedBlog', 'true');
	// 	}
	// });

	let pausedModal: HTMLDialogElement;
	onMount(() => {
		pausedModal.showModal();
	});
</script>

<svelte:head>
	<title>told-you.so</title>
	<meta
		name="description"
		content="A message time capsule 🔮. Write a prediction, save it for the future, and tell them so!"
	/>

	<script
		src="/trends"
		defer
		data-exclude-search="true"
		data-exclude-hash="true"
		data-website-id="821e5fc6-a962-4674-9797-9e3ac207e55e"
	></script>
</svelte:head>

<ModeWatcher defaultMode="dark" defaultTheme="dark" />
<div class="min-h-dvh w-full">
	<Header />
	{@render children()}
</div>

<dialog bind:this={pausedModal} class="modal">
	<div class="modal-box bg-vibrant shadow-xl">
		<h3 class="text-3xl leading-tight font-bold md:leading-snug">Update: November 15th, 2026</h3>
		<p class="mt-2">
			I&apos;m still working on hardening told-you.so. Hopefully, the new site will be up by
			Wednesday (November 17th) evening.
		</p>
		<div class="divider"></div>
		<div class="opacity-60 hover:opacity-100">
			<h3 class="text-3xl leading-tight font-bold md:leading-snug">Update: November 11th, 2026</h3>
			<p class="mt-2">
				Due to the recent Node.js and PostgreSQL vulnerabilities, I am temporarily shutting down
				told-you.so until I can secure my infrastructure.
			</p>
			<p class="mt-2">I expect normal operation by Sunday (November 15th) at the latest.</p>
		</div>
	</div>
	<div class="modal-backdrop bg-black/50"></div>
</dialog>
