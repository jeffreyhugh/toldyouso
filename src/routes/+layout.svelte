<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/quicksand';

	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';

	import { browser } from '$app/environment';
	import { invalidate } from '$app/navigation';
	import { detectAdblock } from '$lib/detectAdblock';

	// import { page } from '$app/state';
	import Header from './Header.svelte';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);
	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});

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

	{#if browser}
		<script
			async
			src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7806885462809506"
			crossorigin="anonymous"
		></script>
	{/if}
</svelte:head>

<ModeWatcher defaultMode="dark" defaultTheme="dark" />
<div class="min-h-dvh w-full">
	<Header />
	{@render children()}
</div>
