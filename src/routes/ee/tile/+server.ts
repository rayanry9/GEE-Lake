import { json } from "@sveltejs/kit";

import { getFinalClassificationFormatUrl, getInitialClassificationFormatUrl } from "$lib/server/gee/visualization";
import type { RequestHandler } from "./$types";
import { LakeData } from "$lib/mapData";

const cloudCover = 30

export const GET: RequestHandler = ({ url }) => {
	let params = url.searchParams
	if (!params.has("AOIId")) {
		return new Response("", { status: 400 })
	}
	let AOIId = parseInt(params.get("AOIId")!)
	let cloudCoverUser = 10
	let startDateUser = '2025-01-01'
	let endDateUser = '2025-01-12'

	return json({ url_format: getFinalClassificationFormatUrl(LakeData[AOIId].geeAssetPath, endDateUser, cloudCover, cloudCoverUser) })
}
