import { cloudCover, LakeData, WaterDataType, type LakesCode } from "$lib/mapData"
import { getFromWaterData, getToWaterData } from "$lib/server/gee/visualization"
import { json } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"

export const GET: RequestHandler = ({ url }) => {
	let params = url.searchParams
	if (!params.has("AOIId")) {
		return new Response("", { status: 400 })
	}
	if (!params.has("waterDataType")) {
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
	let waterDataType = parseInt(params.get("waterDataType")!) as WaterDataType
	let AOIId = parseInt(params.get("AOIId")!) as LakesCode
	let startDateUser = params.get("startDate")!.toString()
	let endDateUser = params.get("endDate")!.toString()

	let cloudCoverUser = 10

	switch (waterDataType) {
		case WaterDataType.ToWater:
			return json({ data: getToWaterData(LakeData[AOIId].geeAssetPath, startDateUser, endDateUser, cloudCover, cloudCoverUser, indices) })
		case WaterDataType.FromWater:
			return json({
				data: getFromWaterData(LakeData[AOIId].geeAssetPath, startDateUser, endDateUser, cloudCover, cloudCoverUser, indices)
			})
	}

}
