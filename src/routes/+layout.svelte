<script lang="ts">
	import "../app.css";
	import Header from "./Header.svelte";
	import "@fontsource-variable/quicksand";

	let { children } = $props();
</script>

<div class="min-h-dvh">
	<Header />
	{@render children()}
</div>
