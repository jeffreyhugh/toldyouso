import { type Action, fail } from '@sveltejs/kit';

export const signin: Action = async ({ url, request, locals: { supabase } }) => {
	const data = await request.formData();

	const email = data.get('email');

	if (!email || email instanceof File) {
		fail(400, {
			error: 'email is required'
		});
		return;
	}

	const { error } = await supabase.auth.signInWithOtp({
		email,
		options: {
			emailRedirectTo: url.protocol + '//' + url.host + '/api/migrate',
			shouldCreateUser: true
		}
	});

	if (error) {
		fail(400, {
			error: error.message
		});
	}

	return { success: true };
};

export const signout: Action = async ({ locals: { supabase } }) => {
	await supabase.auth.signOut();

	return { success: true };
};
