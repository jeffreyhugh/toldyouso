<script lang="ts">
	import { DateTime } from "luxon";
	import CountdownTimer from "./CountdownTimer.svelte";
	import MessageContent from "./MessageContent.svelte";
	import MaxWidthForm from "$lib/MaxWidthForm.svelte";
	import { onMount } from "svelte";

	const { data } = $props();

	const availableAt = DateTime.fromISO(data.available_at || "");

	const transformForTitle = (availableAt: DateTime) =>
		availableAt.diffNow().as("milliseconds") < 0
			? "available now"
			: availableAt
					.diffNow()
					.rescale()
					.set({ milliseconds: 0 })
					.toFormat("y M d h m s")
					.split(" ")
					.map((s, i) => ({ num: Number(s), unit: ["y", "mo", "d", "h", "m", "s"][i] }))
					.filter((item) => item.num)
					.map(
						(item) =>
							`${item.num.toString().padStart(item.unit === "h" || item.unit === "m" || item.unit === "s" ? 2 : 1, "0")}${item.unit}`
					)
					.join(" ");

	let titleAvailableAt = $state(transformForTitle(availableAt));
	onMount(() => {
		const interval = setInterval(() => {
			titleAvailableAt = transformForTitle(availableAt);
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>told-you.so · {titleAvailableAt}</title>
</svelte:head>

<MaxWidthForm>
	{#if availableAt.diffNow().as("seconds") >= 0}
		<CountdownTimer {availableAt} />
	{:else}
		<MessageContent message={data.content} encrypted={data.encrypted} />
	{/if}
	<div class="mt-8 flex w-full justify-center text-sm lowercase opacity-85">
		<table>
			<tbody>
				{#if data.created_at && DateTime.fromISO(data.created_at).isValid}
					<tr>
						<td class="pr-1 text-right">Submitted</td>
						<td>
							{DateTime.fromISO(data.created_at).toRelative()} on {DateTime.fromISO(
								data.created_at
							).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)} <wbr />at {DateTime.fromISO(
								data.created_at
							).toLocaleString(DateTime.TIME_SIMPLE)}
						</td>
					</tr>
				{/if}

				{#if data.available_at && DateTime.fromISO(data.available_at).isValid}
					<tr>
						<td class="pr-1 text-right">Available</td>
						<td>
							{DateTime.fromISO(data.available_at).toRelative()} on {DateTime.fromISO(
								data.available_at
							).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)} <wbr />at {DateTime.fromISO(
								data.available_at
							).toLocaleString(DateTime.TIME_SIMPLE)}
						</td>
					</tr>
				{/if}

				<tr>
					<td class="pr-1 text-right">SHA256</td>
					<td>
						<div class="bg-base-200 rounded-box w-min px-1 py-0.5">
							<code class="leading-none select-all">
								{data.sha256?.substring(0, 32)}<wbr />{data.sha256?.substring(32)}
							</code>
						</div>
					</td>
				</tr>

				{#if data.encrypted}
					<tr>
						<td class="pr-1">Encrypted</td>
						<td>🔒</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</MaxWidthForm>
