<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
	import "../app.css";
	import Header from "./Header.svelte";
	import "@fontsource-variable/quicksand";
	import { onMount } from "svelte";
	import { invalidate } from "$app/navigation";

	let { data, children } = $props();
	let { session, supabase } = $derived(data);
	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate("supabase:auth");
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<ModeWatcher defaultMode="dark" defaultTheme="dark" />
<div class="min-h-dvh">
	<Header />
	{@render children()}
</div>
