<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import MaxWidthForm from '$lib/MaxWidthForm.svelte';
</script>

<MaxWidthForm noAds>
	<div class="flex flex-col items-center gap-2 lowercase">
		<h1 class="text-2xl font-bold md:text-4xl">
			error {page.status}
		</h1>
		<div>
			Do you think you can <a class="link" href={resolve('/')}>predict the next error</a>?
		</div>
	</div>
</MaxWidthForm>
