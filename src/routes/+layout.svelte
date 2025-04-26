<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
	import "../app.css";
	import Header from "./Header.svelte";
	import "@fontsource-variable/quicksand";

	let { children } = $props();
</script>

<ModeWatcher defaultMode="dark" defaultTheme="dark" />
<div class="min-h-dvh">
	<Header />
	{@render children()}
</div>
