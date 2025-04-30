import { redirect } from "@sveltejs/kit";

export const load = () => {
	return redirect(308, "/messages");
};
