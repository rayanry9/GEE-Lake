import "$lib/server/db/init.svelte"
import { type Handle } from "@sveltejs/kit";
import { deleteSessionTokenCookie, setSessionTokenCookie, validateSessionToken } from "$lib/server/db/auth.svelte";
import { Console } from "$lib/server/consoleColors";

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get("session") ?? null
	if (token === null) {
		event.locals.session = null
		return resolve(event)
	}

	const session = await validateSessionToken(token)
	if (session !== null) {
		setSessionTokenCookie(event, token, session.expiresAt)
	} else {
		Console.requestError("Cookie", event.getClientAddress(), event.url.toString(), "Expired Cookie")
		deleteSessionTokenCookie(event)
	}
	event.locals.session = session
	return resolve(event)
}

