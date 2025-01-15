import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getBounds, getUrlFormat, isInitiazlized } from "$lib/server/gee/init.svelte";

var initState = false

isInitiazlized.subscribe((val) => {
	initState = val
})

export const GET: RequestHandler = ({ url }) => {

	return json({ url_format: getUrlFormat(), bounds: getBounds() })
}
