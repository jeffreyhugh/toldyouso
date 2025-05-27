<script lang="ts">
	import { setMode, setTheme, theme } from 'mode-watcher';

	import { page } from '$app/state';

	let visitedBlog: string | null = $state('true');
	$effect(() => {
		if (page.url) {
			visitedBlog = localStorage.getItem('visitedBlog');
		}
	});
</script>

<div class="mb-8 flex w-full flex-col items-stretch gap-2">
	<div class="flex justify-end">
		<button
			class="btn btn-ghost btn-circle m-2 text-xl"
			onclick={() => {
				if (theme.current === 'dark') {
					setMode('light');
					setTheme('light');
				} else {
					setMode('dark');
					setTheme('dark');
				}
			}}
		>
			{#if theme.current === 'light'}
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
		<a href="/blog" class="indicator lowercase italic">
			{#if !page.url.pathname.startsWith('/blog') && visitedBlog === null}
				<span class="indicator-item status bg-vibrant translate-x-2.5 translate-y-1" title="new"
				></span>
				<span
					class="indicator-item status bg-vibrant translate-x-2.5 translate-y-1 motion-safe:animate-ping"
					title="new"
				></span>
			{/if}
			<span>Blog</span>
		</a>
		<div class="hidden md:block">&middot;</div>
		<a href="/legal" class="lowercase italic">Legal</a>
		<div class="hidden md:block">&middot;</div>
		<a href="https://github.com/jeffreyhugh/toldyouso" target="_blank" class="lowercase italic"
			>GitHub</a
		>
	</div>
</div>
