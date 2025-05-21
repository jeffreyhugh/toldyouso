<script lang="ts">
	import { DateTime } from 'luxon';

	import MaxWidthArticle from '$lib/MaxWidthArticle.svelte';

	let { data } = $props();

	const { title, description, author, date } = $derived(data.meta);
	const { PostContent } = $derived(data);

	const createdAt = $derived(DateTime.fromFormat(date || '', 'M/d/y'));
</script>

<svelte:head>
	<title>told-you.so {title ? `· ${title?.toLowerCase()}` : ''}</title>
	{#if description}<meta
			name="description"
			content={description +
				'\n\ntold-you.so is a message time capsule 🔮. Write a prediction, save it for the future, and tell them so!'}
		/>{/if}
	{#if author}<meta name="author" content={author} />{/if}
</svelte:head>

<MaxWidthArticle>
	<article class="mt-4 w-full">
		{#if title}
			<h1 class="text-4xl font-extrabold lowercase">{title}</h1>
		{/if}
		{#if author || createdAt.isValid}
			<p class="my-2 text-sm">
				{#if author}
					by {author}
				{/if}
				{#if author && createdAt.isValid}
					<span class="mx-1">&middot;</span>
				{/if}
				{#if createdAt.isValid}
					<span class="lowercase">{createdAt.toLocaleString(DateTime.DATE_FULL)}</span>
				{/if}
			</p>
		{/if}
		<div class="divider"></div>
		<div
			class={[
				'prose max-w-none',
				'prose-h1:lowercase prose-h2:lowercase prose-h3:lowercase prose-h4:lowercase',
				'prose-a:has-[span]:has-[.link-icon]:no-underline prose-a:has-[span]:has-[.link-icon]:pl-2',
				'prose-a:has-[span]:has-[.link-icon]:hover:underline',
				'prose-a:text-transparent prose-a:bg-clip-text prose-a:bg-gradient-to-br prose-a:from-fuchsia-600 prose-a:to-purple-600'
			]}
		>
			<PostContent />
		</div>
	</article>
	<div class="divider"></div>
	<div>
		<a href="/blog" class="btn bg-vibrant btn-lg text-white lowercase">More Posts</a>
	</div>
</MaxWidthArticle>
<div class="h-8"></div>
