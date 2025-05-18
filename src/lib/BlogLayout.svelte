<script lang="ts">
	import type { Snippet } from 'svelte';

	import MaxWidthArticle from './MaxWidthArticle.svelte';

	const { title, children }: { title: string; children: Snippet } = $props();
</script>

<MaxWidthArticle>
	<div class="text-2xl font-bold md:text-4xl">{title}</div>
	<div class="prose">
		{@render children()}
	</div>
</MaxWidthArticle>
