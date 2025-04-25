import { DateTime } from "luxon";
import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { encrypt } from "$lib/crypt";
import { supabase } from "$lib/supabase";
import { supabaseServiceRole } from "$lib/server/supabaseServiceRole";

export const load: PageServerLoad = async () => {
	const { data } = await supabase.auth.getUser();

	if (!data.user) {
		await supabase.auth.signInAnonymously();
	}

	return {
		email: data.user?.email
	};
};

export const actions: Actions = {
	createMessage: async ({ request }) => {
		const data = await request.formData();

		let message = data.get("message");
		const password = data.get("password");
		const availableAt = data.get("datetime");
		const timezone = data.get("timezone");
		let encrypted = data.get("encrypted");

		if (!message || message instanceof File) {
			return fail(400, {
				error: "message is required"
			});
		} else if (!availableAt || availableAt instanceof File) {
			return fail(400, {
				error: "availableAt is required"
			});
		} else if (!timezone || timezone instanceof File) {
			return fail(400, {
				error: "timezone is required"
			});
		}

		const utcString = DateTime.fromISO(availableAt || "", {
			zone: timezone
		})
			.setZone(timezone)
			.toISO();
		if (!utcString) {
			return fail(400, {
				error: "invalid tz"
			});
		}

		if (password && !(password instanceof File)) {
			message = await encrypt(message, password);
			encrypted = "true";
		}

		const user = await supabase.auth.getUser();
		const resp = await supabaseServiceRole
			.from("messages")
			.insert({
				available_at: utcString,
				content: message,
				encrypted: encrypted === "true",
				owned_by: user.data.user?.id || "00000000-0000-0000-0000-000000000000"
			})
			.select("*")
			.maybeSingle();

		if (resp.error || !resp.data?.id) {
			return fail(500, { error: resp.error });
		}

		return redirect(307, `/message/${resp.data.id}`);
	}
};
