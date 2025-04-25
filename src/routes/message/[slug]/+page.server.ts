import { supabase } from "$lib/supabase";
import { error } from "@sveltejs/kit";

export const load = async ({ params }) => {
	const { data, error: sbError } = await supabase
		.from("userview")
		.select("*")
		.eq("id", params.slug)
		.maybeSingle();

	if (sbError) {
		return error(500, sbError);
	} else if (!data) {
		return error(404);
	}

	return data;
};
