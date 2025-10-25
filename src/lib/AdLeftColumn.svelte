<script lang="ts">
	import { onMount } from 'svelte';

	import { LeftColumn } from './adSlots';

	onMount(() => {
		(window.adsbygoogle = window.adsbygoogle || []).push({});
	});
</script>

<div>
	<ins
		class="adsbygoogle"
		style="display:block"
		data-ad-client="ca-pub-7806885462809506"
		data-ad-slot={LeftColumn}
		data-ad-format="auto"
		data-full-width-responsive="true"
	></ins>
</div>
