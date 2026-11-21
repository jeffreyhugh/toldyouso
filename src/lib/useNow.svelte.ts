// https://github.com/ariefsn/svelte-use/blob/main/src/lib/time/useNow.svelte.ts
import { DateTime } from 'luxon';

export const useNow = () => {
	let timestamp = $state(DateTime.now());

	$effect(() => {
		const id = setInterval(() => {
			timestamp = DateTime.now();
		}, 1000);

		return () => {
			clearInterval(id);
		};
	});

	return () => timestamp;
};
