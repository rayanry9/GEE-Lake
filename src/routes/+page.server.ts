import { initGEE } from "$lib/server/gee/init"
import type { PageServerLoad } from "./$types"

export const ssr = false

export const load: PageServerLoad = async (event) => {
	await initGEE()
}
