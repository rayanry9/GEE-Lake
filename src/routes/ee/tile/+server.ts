import { json } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";
import { cloudCover, type LakeCode } from "$lib/mapData";
import { getAllFormatUrls } from "$lib/server/gee/visualization";
import { Console } from "$lib/server/consoleColors";

export const GET: RequestHandler = async (req) => {
	Console.requestInfo("GET", req.getClientAddress(), req.url.toString(), "Request for Tile Data")

	let params = req.url.searchParams
	if (!params.has("AOIId")) {

		Console.requestError("400", req.getClientAddress(), req.url.toString(), "Invalid / No AOI Id")

		return new Response("No AOIId param", { status: 400 })
	}
	if (!params.has("indices")) {

		Console.requestError("400", req.getClientAddress(), req.url.toString(), "Invalid / No Indices")

		return new Response("No Indices Param", { status: 400 })
	}
	if (!params.has("startDate")) {

		Console.requestError("400", req.getClientAddress(), req.url.toString(), "Invalid / No Start Date")

		return new Response("No StartDate Param", { status: 400 })
	}
	if (!params.has("endDate")) {

		Console.requestError("400", req.getClientAddress(), req.url.toString(), "Invalid / No End Date")

		return new Response("No End Date Param", { status: 400 })
	}

	let indices = params.get("indices")!
	let AOIId = parseInt(params.get("AOIId")!) as LakeCode
	let startDateUser = params.get("startDate")!.toString()
	let endDateUser = params.get("endDate")!.toString()

	let cloudCoverUser = 10
	let resData = await getAllFormatUrls(AOIId, startDateUser, endDateUser, cloudCover, cloudCoverUser, indices)
	if (resData == null) {
		Console.requestError("500", req.getClientAddress(), req.url.toString(), "Server Internal Error")
		return json("", { status: 500 })
	}

	Console.requestSuccess("200", req.getClientAddress(), req.url.toString(), "Fulfilled Tile Data Request")

	return json(resData)
}
