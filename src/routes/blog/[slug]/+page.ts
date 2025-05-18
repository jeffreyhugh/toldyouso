import { error, type Load } from '@sveltejs/kit';

import type SvxComponent_t from '$lib/SvxComponent';

export const load: Load = async ({ params }) => {
	try {
		const post = (await import(
			/* @vite-ignore */
			`../content/${params.slug}.svx`
		)) as SvxComponent_t;

		return {
			PostContent: post.default,
			meta: { ...post.metadata, slug: params.slug }
		};
	} catch (err) {
		console.error(err);
		error(404);
	}
};
