import { redirect } from '@sveltejs/kit';

import { supabaseServiceRole } from '$lib/server/supabaseServiceRole';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const { data } = await supabase.auth.getUser();
	const anonID = data.user?.id;

	const code = url.searchParams.get('code');

	if (!code) {
		redirect(307, '/error?message=No%20code');
	}
	const { data: newUserData, error: newUserError } =
		await supabase.auth.exchangeCodeForSession(code);

	if (newUserError) {
		console.error(newUserError);
	}

	const newUserID = newUserData.user?.id;

	if (anonID && newUserID) {
		// row updates
		const { error } = await supabaseServiceRole
			.from('messages')
			.update({ owned_by: newUserID })
			.eq('owned_by', anonID);

		if (error) {
			redirect(307, `/error?message="Migration%20error`);
		}
	}

	redirect(307, `/`);
};
