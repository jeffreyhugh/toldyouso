<script lang="ts">
	import { DateTime } from 'luxon';

	import MaxWidthArticle from '$lib/MaxWidthArticle.svelte';

	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();
	let featuredOnly = $state(false);
</script>

<svelte:head>
	<title>told-you.so · blog</title>
</svelte:head>

<MaxWidthArticle>
	<!-- <div class="mb-4 flex w-full items-center gap-2">
		Featured Articles
		<input type="checkbox" class="toggle" bind:checked={featuredOnly} />
	</div> -->
	{#each data.data.blogEntries as blogEntryMetadata (blogEntryMetadata.slug)}
		{@render blogEntry(
			blogEntryMetadata,
			DateTime.fromFormat(blogEntryMetadata.date || '', 'M/d/y')
		)}
	{/each}
</MaxWidthArticle>

{#snippet blogEntry(
	metadata: {
		title?: string | undefined;
		description?: string | undefined;
		author?: string | undefined;
		date?: string | undefined;
		slug: string | null;
	},
	createdAt: DateTime
)}
	<a
		href={`/blog/${metadata.slug}`}
		class={[
			'bg-base-200 hover:bg-base-300 rounded-box flex w-full flex-col gap-1 p-4',
			featuredOnly && metadata.author !== 'Jeffrey Hugh' && 'hidden'
		]}
	>
		{#if metadata.title}
			<div class="flex items-center gap-3 text-2xl font-bold lowercase">
				{#if metadata.author === 'Jeffrey Hugh'}
					<span title="featured" class="bg-vibrant aspect-square size-4 rounded-md"></span>
				{/if}
				{metadata.title}
			</div>
		{/if}
		{#if metadata.description}<div class="text-base">{metadata.description}</div>{/if}
		<div class="mt-4 text-xs">
			{#if metadata.author || createdAt.isValid}
				{#if metadata.author}
					{metadata.author}
				{/if}
				{#if metadata.author && createdAt.isValid}
					&middot;
				{/if}
				{#if createdAt.isValid}
					{createdAt.toLocaleString(DateTime.DATE_FULL)}
				{/if}
			{/if}
		</div>
	</a>
{/snippet}
