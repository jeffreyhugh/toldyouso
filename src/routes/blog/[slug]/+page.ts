import { error, type Load } from '@sveltejs/kit';
import { DateTime } from 'luxon';

import type SvxComponent_t from '$lib/SvxComponent';

export const load: Load = async ({ params }) => {
	const modules = import.meta.glob('/src/lib/content/*.svx');

	const contentModule = modules[`/src/lib/content/${params.slug}.svx`];

	if (!contentModule) {
		error(404);
	}

	const { default: component, metadata } = (await contentModule().then()) as SvxComponent_t;

	const createdAt = DateTime.fromFormat(metadata.date || '', 'M/d/y');
	if (createdAt.isValid && createdAt.diffNow().as('seconds') > 0) {
		error(404);
	}

	return {
		PostContent: component,
		meta: { ...metadata, slug: params.slug }
	};
};
