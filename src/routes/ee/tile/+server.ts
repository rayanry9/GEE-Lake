import { json } from "@sveltejs/kit";

import { getFinalClassificationFormatUrl, getInitialClassificationFormatUrl } from "$lib/server/gee/visualization";
import type { RequestHandler } from "./$types";
import { EETileLayerType, LakeData } from "$lib/mapData.svelte";

const cloudCover = 30

export interface TileResponseType {
	urlFormat: string
}

export const GET: RequestHandler = ({ url }) => {
	let params = url.searchParams
	if (!params.has("AOIId")) {
		return new Response("", { status: 400 })
	}
	if (!params.has("tileType")) {
		return new Response("", { status: 400 })
	}
	let tileTypeToShow = parseInt(params.get("tileType")!) as EETileLayerType
	let AOIId = parseInt(params.get("AOIId")!)
	let cloudCoverUser = 10
	let startDateUser = '2025-01-01'
	let endDateUser = '2025-01-12'

	switch (tileTypeToShow) {
		case EETileLayerType.FinalClassification:
			return json({ urlFormat: getFinalClassificationFormatUrl(LakeData[AOIId].geeAssetPath, endDateUser, cloudCover, cloudCoverUser) } satisfies TileResponseType)
		case EETileLayerType.InitialClassification:
			return json({ urlFormat: getInitialClassificationFormatUrl(LakeData[AOIId].geeAssetPath, endDateUser, cloudCover, cloudCoverUser) } satisfies TileResponseType)
	}

	return json({ urlFormat: getFinalClassificationFormatUrl(LakeData[AOIId].geeAssetPath, endDateUser, cloudCover, cloudCoverUser) } satisfies TileResponseType)
}
