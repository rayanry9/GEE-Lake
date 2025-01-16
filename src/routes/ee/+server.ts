import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getUrlFormat } from "$lib/server/gee/init.svelte";


export const GET: RequestHandler = ({ url }) => {
	return json({ url_format: getUrlFormat() })
}
