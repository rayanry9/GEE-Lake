import "$lib/server/gee/init.svelte"
import "$lib/server/db/init.svelte"
import { type Handle } from "@sveltejs/kit";
import { deleteSessionTokenCookie, setSessionTokenCookie, validateSessionToken } from "$lib/server/db/auth.svelte";

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
		deleteSessionTokenCookie(event)
	}

	event.locals.session = session
	return resolve(event)
}

