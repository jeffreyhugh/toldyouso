<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	const { legacySlug } = page.params;
	goto(`/messages/${legacySlug}`, {
		replace: true
	});
</script>
