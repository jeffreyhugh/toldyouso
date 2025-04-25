<script lang="ts">
	import { onMount } from "svelte";

	let theme: string | null = $state(null);

	const setTheme = (newTheme: typeof theme) => {
		theme = newTheme ?? "dark";
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("theme", theme);
	};

	onMount(() => {
		let newTheme = localStorage.getItem("theme");
		if (!newTheme) {
			newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
		}
		setTheme(newTheme);
	});
</script>

<div class="mb-8 flex w-full flex-col items-stretch gap-2">
	<div class="flex justify-end">
		<button
			class="btn btn-ghost btn-circle m-2 text-xl"
			onclick={() => setTheme(theme === "dark" ? "light" : "dark")}
		>
			{#if theme === "light"}
				☀️
			{:else}
				🌑
			{/if}
		</button>
	</div>
	<div
		class="text-vibrant p-2 text-center text-6xl leading-tight font-bold text-transparent select-none md:text-8xl md:leading-snug"
	>
		<a href="/">told-you.so</a>
	</div>
	<div class="text-center text-xl lowercase select-none md:text-3xl">A message time capsule 🔮</div>
	<div
		class="mt-2 flex flex-col items-center justify-center gap-x-2 text-lg md:flex-row md:text-xl"
	>
		<a href="/" class="lowercase italic">Store a Message</a>
		<div class="hidden md:block">&middot;</div>
		<a href="/messages" class="lowercase italic">My Messages</a>
		<div class="hidden md:block">&middot;</div>
		<a href="/about" class="lowercase italic">About</a>
		<div class="hidden md:block">&middot;</div>
		<a href="/legal" class="lowercase italic">Legal</a>
		<div class="hidden md:block">&middot;</div>
		<a href="https://github.com/jeffreyhugh/toldyouso" class="lowercase italic">GitHub</a>
	</div>
</div>
