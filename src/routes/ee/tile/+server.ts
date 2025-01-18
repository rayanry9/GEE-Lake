import { json } from "@sveltejs/kit";

import { getFinalClassificationFormatUrl, getInitialClassificationFormatUrl, getRecentImgFormatUrl, getStartImgFormatUrl } from "$lib/server/gee/visualization";
import type { RequestHandler } from "./$types";
import { EETileLayerType, LakeData, LakesCode, type TileResponseTypeAPI } from "$lib/mapData";

const cloudCover = 30

export const GET: RequestHandler = ({ url }) => {
	let params = url.searchParams
	if (!params.has("AOIId")) {
		return new Response("", { status: 400 })
	}
	if (!params.has("tileType")) {
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
	let tileTypeToShow = parseInt(params.get("tileType")!) as EETileLayerType
	let AOIId = parseInt(params.get("AOIId")!) as LakesCode
	let startDateUser = params.get("startDate")!.toString()
	let endDateUser = params.get("endDate")!.toString()

	let cloudCoverUser = 10

	switch (tileTypeToShow) {
		case EETileLayerType.FinalClassification:
			return json({ urlFormat: getFinalClassificationFormatUrl(LakeData[AOIId].geeAssetPath, endDateUser, cloudCover, cloudCoverUser, indices) } satisfies TileResponseTypeAPI)
		case EETileLayerType.InitialClassification:
			return json({ urlFormat: getInitialClassificationFormatUrl(LakeData[AOIId].geeAssetPath, endDateUser, cloudCover, cloudCoverUser, indices) } satisfies TileResponseTypeAPI)
		case EETileLayerType.StartImage:
			return json({ urlFormat: getStartImgFormatUrl(LakeData[AOIId].geeAssetPath, endDateUser, cloudCover, cloudCoverUser, indices) } satisfies TileResponseTypeAPI)
		case EETileLayerType.RecentImage:
			return json({ urlFormat: getRecentImgFormatUrl(LakeData[AOIId].geeAssetPath, endDateUser, cloudCover, cloudCoverUser, indices) } satisfies TileResponseTypeAPI)
	}
}
