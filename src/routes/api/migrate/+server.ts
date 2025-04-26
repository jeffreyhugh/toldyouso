import { supabaseServiceRole } from "$lib/server/supabaseServiceRole.js";
import { supabase } from "$lib/supabase.js";
import { redirect } from "@sveltejs/kit";

export async function GET({ url }) {
	const anonID = url.searchParams.get("anonID");

	const { data } = await supabase.auth.getUser();

	const userID = data.user?.id;

	if (anonID && userID) {
		await supabaseServiceRole
			.from("messages")
			.update({ owned_by: data.user?.id })
			.eq("owned_by", anonID);
	}

	return redirect(307, "/");
}
