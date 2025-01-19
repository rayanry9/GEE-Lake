import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding"
import { sha256 } from "@oslojs/crypto/sha2"
import { sql } from "./init.svelte"
import type { RequestEvent } from "@sveltejs/kit"

const DAYS_TO_EXPIRE = 10

export interface Session {
	id: string,
	userId: number,
	expiresAt: Date
}


export interface User {
	id: number,
	email: string,
}

export function generateSessionToken(): string {
	const bytes = new Uint8Array(24)
	crypto.getRandomValues(bytes)
	const token = encodeBase32LowerCaseNoPadding(bytes)
	return token
}

export async function createSession(token: string, userId: number): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * DAYS_TO_EXPIRE)
	}

	await sql`UPDATE users SET session_id = ${sessionId}, session_expiration = ${session.expiresAt} WHERE id = ${session.userId} `
	return session
}

export async function validateSessionToken(token: string): Promise<Session | null> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const rows = (await sql`SELECT id, email, session_expiration FROM users WHERE session_id = ${sessionId}`)
	if (rows.count == 0) {
		return null
	}

	const session: Session = {
		userId: rows[0]["id"] as number,
		id: sessionId,
		expiresAt: rows[0]["session_expiration"] as Date
	}

	if (Date.now() >= session.expiresAt.getTime()) {
		await sql`UPDATE users SET session_id = NULL, session_expiration = NULL WHERE id = ${session.userId}`
		return null
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 12 * DAYS_TO_EXPIRE) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * DAYS_TO_EXPIRE);
		await sql` UPDATE users SET expires_at = ${session.expiresAt} WHERE id = ${session.userId} `
	}
	return session
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await sql`UPDATE users SET session_id = NULL, session_expiration = NULL WHERE sessionId = ${sessionId}`
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set("session", token, {
		httpOnly: true,
		sameSite: "lax",
		expires: expiresAt,
		path: "/",
		//	secure: false
	})
}
export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set("session", "", {
		httpOnly: true,
		sameSite: "lax",
		maxAge: 0,
		path: "/"
	})
}

export async function isValidUser(email: string, password: string): Promise<number | null> {
	const row = await sql` SELECT id FROM users WHERE email = ${email} AND password = ${password}`
	if (row.count == 0) {
		return null
	} else {
		return row[0]["id"]
	}
}
