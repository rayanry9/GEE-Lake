import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getInitialClassificationFormatUrl } from "$lib/server/gee/visualization";


export const GET: RequestHandler = ({ url }) => {
	return json({ url_format: getInitialClassificationFormatUrl() })
}
