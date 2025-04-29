<script lang="ts">
	import { page } from "$app/state";
	import MaxWidthForm from "$lib/MaxWidthForm.svelte";

	const message = page.url.searchParams.get("message");
</script>

<svelte:head>
	<title>told-you.so · error</title>
</svelte:head>

<MaxWidthForm>
	Error: {message}
</MaxWidthForm>
