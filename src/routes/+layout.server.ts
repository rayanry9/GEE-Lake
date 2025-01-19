import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { Console } from "$lib/server/consoleColors";

export const load: LayoutServerLoad = async (event) => {
	if (!event.url.pathname.includes("/login")) {

		if (event.locals.session === null) {
			Console.requestError("Cookie", event.getClientAddress(), event.url.toString(), "Non Authenticated Try To Access To Site | No Cookie")
			Console.requestInfo("307", event.getClientAddress(), event.url.toString(), "Redirect To Login")
			redirect(307, "/login")
		}
	}
}
