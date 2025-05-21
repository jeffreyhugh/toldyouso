import type { Load } from '@sveltejs/kit';
import { DateTime } from 'luxon';

import type SvxComponent_t from '$lib/SvxComponent';

export const load: Load = async () => {
	const modules = import.meta.glob('/src/lib/content/*.svx');

	const blogPromises = Object.entries(modules).map(([path, resolver]) =>
		resolver().then((post) => ({
			slug: slugFromPath(path),
			...(post as unknown as SvxComponent_t).metadata
		}))
	);

	const blogEntries = await Promise.all(blogPromises);

	blogEntries.sort(
		(a, b) =>
			DateTime.fromFormat(b.date || '', 'M/d/y').toUnixInteger() -
			DateTime.fromFormat(a.date || '', 'M/d/y').toUnixInteger()
	);

	return {
		data: { blogEntries }
	};
};

const slugFromPath = (path: string) => path.match(/([\w-]+)\.(svx)/i)?.[1] ?? null;
