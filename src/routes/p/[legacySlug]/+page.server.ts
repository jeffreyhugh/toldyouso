import { error, redirect } from '@sveltejs/kit';

export const load = async ({ params, locals: { supabase } }) => {
	const { data, error: sbError } = await supabase
		.from('userview')
		.select('*')
		.eq('legacy_slug', params.legacySlug)
		.maybeSingle();

	if (sbError) {
		return error(404, sbError);
	} else if (!data) {
		return error(404);
	}

	if (!data.encrypted) {
		return redirect(308, `/messages/${data.id}`);
	}

	return data;
};
