import { error } from '@sveltejs/kit';

import { signin, signout } from '$lib/authActions.js';

import type { Actions } from './$types.js';

export const load = async ({ locals: { supabase } }) => {
	const { data: userData } = await supabase.auth.getUser();
	if (!userData.user) {
		return error(401);
	}

	const { data, error: userViewError } = await supabase
		.from('userview')
		.select('*')
		.eq('owned_by', userData.user.id)
		.order('available_at');

	if (userViewError) {
		return error(500);
	}

	return { rows: data };
};

export const actions: Actions = {
	signin,
	signout
};
