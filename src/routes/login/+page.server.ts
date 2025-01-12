import { createSession, generateSessionToken, isValidUser, setSessionTokenCookie } from "$lib/server/db/auth.svelte";
import type { Actions } from "./$types";

export const actions = {
	default: async (event) => {
		const data = await event.request.formData()
		const email = data.get('email')
		const password = data.get('password')

		if (email == null) {

		}

		const userId = await isValidUser(email!.toString(), password!.toString())
		console.log(userId)
		if (userId != null) {
			const token = generateSessionToken()
			const session = await createSession(token, userId)
			setSessionTokenCookie(event, token, session.expiresAt)

		} else {
			return { success: false }
		}

		return { success: true }
	}

} satisfies Actions
