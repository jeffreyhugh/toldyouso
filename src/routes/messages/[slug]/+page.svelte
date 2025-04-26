<script lang="ts">
	import { DateTime } from "luxon";
	import CountdownTimer from "./CountdownTimer.svelte";
	import MessageContent from "./MessageContent.svelte";

	const { data } = $props();

	const availableAt = DateTime.fromISO(data.available_at || "");
</script>

<div class="mx-auto mb-8 flex w-11/12 max-w-lg flex-col gap-4 text-lg">
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
			</tbody>
		</table>
	</div>
</div>
