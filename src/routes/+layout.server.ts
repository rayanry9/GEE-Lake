import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
	if (!event.url.pathname.includes("/login")) {
		if (event.locals.session === null) {
			return redirect(307, "/login")
		}
	}
}
