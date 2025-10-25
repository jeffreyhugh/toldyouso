<script lang="ts">
	import { onMount } from 'svelte';

	import { BeforeSubmit } from './adSlots';

	onMount(() => {
		try {
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		} catch (err: unknown) {
			console.error(err);
		}
	});
</script>

<div>
	<ins
		class="adsbygoogle"
		style="display:block"
		data-ad-client="ca-pub-7806885462809506"
		data-ad-slot={BeforeSubmit}
		data-ad-format="auto"
		data-full-width-responsive="true"
	></ins>
</div>
