import { Console } from "$lib/server/consoleColors"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async (event) => {
	Console.requestInfo("GET", event.getClientAddress(), event.url.toString(), "Accessing /tutorial")
}
