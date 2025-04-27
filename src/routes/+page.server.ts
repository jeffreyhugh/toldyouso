import { DateTime } from "luxon";
import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { encrypt } from "$lib/crypt";
import { supabaseServiceRole } from "$lib/server/supabaseServiceRole";
import { signin, signout } from "$lib/authActions";

export const actions: Actions = {
	signin,
	signout,
	createMessage: async ({ request, locals: { supabase } }) => {
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

		return redirect(307, `/messages/${resp.data.id}`);
	}
};
