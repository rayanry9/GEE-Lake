import { json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";
import { cloudCover, type LakeCode } from "$lib/mapData";
import { getAllFormatUrls } from "$lib/server/gee/visualization";

export const GET: RequestHandler = async ({ url }) => {
	let params = url.searchParams
	if (!params.has("AOIId")) {
		return new Response("", { status: 400 })
	}
	if (!params.has("indices")) {
		return new Response("", { status: 400 })
	}
	if (!params.has("startDate")) {
		return new Response("", { status: 400 })
	}
	if (!params.has("endDate")) {
		return new Response("", { status: 400 })
	}

	let indices = params.get("indices")!
	let AOIId = parseInt(params.get("AOIId")!) as LakeCode
	let startDateUser = params.get("startDate")!.toString()
	let endDateUser = params.get("endDate")!.toString()

	let cloudCoverUser = 10

	return json(await getAllFormatUrls(AOIId, startDateUser, endDateUser, cloudCover, cloudCoverUser, indices))
}
