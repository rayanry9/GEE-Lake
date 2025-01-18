import { json } from "@sveltejs/kit";

import { getFinalClassificationFormatUrl, getFromWaterFormatUrl, getInitialClassificationFormatUrl, getRecentImgFormatUrl, getStartImgFormatUrl, getToWaterFormatUrl } from "$lib/server/gee/visualization";
import type { RequestHandler } from "./$types";
import { cloudCover, EELayerType, LakeData, LakesCode, type TileResponseTypeAPI } from "$lib/mapData";

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
	let tileTypeToShow = parseInt(params.get("tileType")!) as EELayerType
	let AOIId = parseInt(params.get("AOIId")!) as LakesCode
	let startDateUser = params.get("startDate")!.toString()
	let endDateUser = params.get("endDate")!.toString()

	let cloudCoverUser = 10

	switch (tileTypeToShow) {
		case EELayerType.FinalClassification:
			return json({ urlFormat: getFinalClassificationFormatUrl(LakeData[AOIId].geeAssetPath, endDateUser, cloudCover, cloudCoverUser, indices) } satisfies TileResponseTypeAPI)
		case EELayerType.InitialClassification:
			return json({ urlFormat: getInitialClassificationFormatUrl(LakeData[AOIId].geeAssetPath, startDateUser, cloudCover, cloudCoverUser, indices) } satisfies TileResponseTypeAPI)
		case EELayerType.StartImage:
			return json({ urlFormat: getStartImgFormatUrl(LakeData[AOIId].geeAssetPath, startDateUser, cloudCover, cloudCoverUser, indices) } satisfies TileResponseTypeAPI)
		case EELayerType.RecentImage:
			return json({ urlFormat: getRecentImgFormatUrl(LakeData[AOIId].geeAssetPath, endDateUser, cloudCover, cloudCoverUser, indices) } satisfies TileResponseTypeAPI)
		case EELayerType.FromWater:
			return json({ urlFormat: getFromWaterFormatUrl(LakeData[AOIId].geeAssetPath, startDateUser, endDateUser, cloudCover, cloudCoverUser, indices) } satisfies TileResponseTypeAPI)
		case EELayerType.ToWater:
			return json({ urlFormat: getToWaterFormatUrl(LakeData[AOIId].geeAssetPath, startDateUser, endDateUser, cloudCover, cloudCoverUser, indices) } satisfies TileResponseTypeAPI)
	}
}
