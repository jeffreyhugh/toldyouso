<script lang="ts">
	import { page } from "$app/state";

	const message = page.url.searchParams.get("message");
</script>
