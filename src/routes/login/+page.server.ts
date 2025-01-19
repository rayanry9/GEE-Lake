import { createSession, generateSessionToken, isValidUser, setSessionTokenCookie } from "$lib/server/db/auth.svelte";
import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { Console } from "$lib/server/consoleColors";

export const load: PageServerLoad = async (event) => {
	Console.requestInfo("GET", event.getClientAddress(), event.url.toString(), "Accessing /login")
}

export const actions = {
	default: async (event) => {
		Console.requestInfo("Login", event.getClientAddress(), event.url.toString(), "Login Initiate")
		const data = await event.request.formData()
		const email = data.get('email')
		const password = data.get('password')

		const userId = await isValidUser(email!.toString(), password!.toString())

		if (userId != null) {
			const token = generateSessionToken()
			const session = await createSession(token, userId)
			setSessionTokenCookie(event, token, session.expiresAt)
			Console.requestSuccess("Login", event.getClientAddress(), event.url.toString(), "Successfull Login and Cookie Set")

		} else {
			Console.requestError("Login", event.getClientAddress(), event.url.toString(), "Invalid User Credentials")
			return { success: false }
		}

		Console.requestInfo("303", event.getClientAddress(), event.url.toString(), "Redirect to /")
		return redirect(303, "/")
	}

} satisfies Actions
