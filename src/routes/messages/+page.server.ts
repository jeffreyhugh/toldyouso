import { error } from "@sveltejs/kit";
import type { Actions } from "./$types.js";
import { signin, signout } from "$lib/authActions.js";

export const load = async ({ params, locals: { supabase } }) => {
	const { data: userData } = await supabase.auth.getUser();
	if (!userData.user) {
		return error(401);
	}

	const { data, error: userViewError } = await supabase
		.from("userview")
		.select("*")
		.eq("owned_by", userData.user.id)
		.order("available_at");

	if (userViewError) {
		return error(500);
	}

	return { rows: data };
};

export const actions: Actions = {
	signin,
	signout
};
