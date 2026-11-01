<script lang="ts">
	import MaxWidthForm from '#lib/MaxWidthForm.svelte';
	import { page } from '$app/state';

	const message = page.url.searchParams.get('message');
</script>

<svelte:head>
	<title>told-you.so · error</title>
</svelte:head>

<MaxWidthForm>
	Error: {message}
</MaxWidthForm>
