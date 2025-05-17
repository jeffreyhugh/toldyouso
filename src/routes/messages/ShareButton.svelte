<script lang="ts">
	const { id }: { id: string } = $props();

	const share = () => {
		if (navigator && navigator.canShare && navigator.canShare()) {
			navigator.share({ url: `https://told-you.so/messages/${id}` });
		}
	};
</script>

<button
	class={[
		'btn btn-ghost btn-sm lowercase',
		!(navigator && navigator.canShare && navigator.canShare()) && 'hidden'
	]}
	type="button"
	onclick={share}
	data-umami-event="share"
>
	↗️ Share
</button>
