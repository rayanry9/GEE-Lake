import postgres from 'postgres'
import { DB_URL } from '$env/static/private'

export const sql = postgres(DB_URL)

export async function createUserTable() {
    console.info(new Date().toLocaleString(), "| DB CREATE")
    await sql`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        session_id TEXT,
        session_expiration TIMESTAMPTZ
    );`
}
