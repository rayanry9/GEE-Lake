//@ts-ignore
import L from "leaflet"
//@ts-ignore
import shp from "shpjs"
import { EELayerType, IndicesData, LakeData, LakesCode, WaterDataType, type TileResponseTypeAPI } from "./mapData";

let mapContainer: any
let baseMapLayer: any
let shapeGeoJson: any
var geeTileLayer: null | any = null

let currentLayerType = $state<EELayerType>(EELayerType.RecentImage)
let memoMapForTileUrls = new Map<string, string>()

export function setCurrentLayerType(type: EELayerType) {
	currentLayerType = type
}

let currentLakeId = $state<LakesCode>(LakesCode.Ammenpur)
export function setCurrentLakeId(id: LakesCode) {
	currentLakeId = id
}

let indicesState = $state(new Array<boolean>(IndicesData.length))
for (let i = 0; i < IndicesData.length; i++) {
	indicesState[i] = true
}

let startDate = $state("2025-01-01")
export function setStartDate(date: string) {
	startDate = date
}

let endDate = $state("2025-01-12")
export function setEndDate(date: string) {
	endDate = date
}

export function createMap(container: HTMLElement) {

	mapContainer = L.map(container).setView([0, 0], 2);
	baseMapLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	})
	baseMapLayer.addTo(mapContainer);

	L.control.scale({ position: 'bottomleft' }).addTo(mapContainer)

	$effect(() => {
		addLakeShapeToMap(currentLakeId)
	})
	$effect(() => {
		addEETileLayer(currentLakeId, currentLayerType, JSON.stringify(indicesState), startDate, endDate)
	})
	$effect(() => {
		getWaterData(currentLakeId, WaterDataType.ToWater, JSON.stringify(indicesState), startDate, endDate)
	})
}

export function addLakeShapeToMap(lakeId: LakesCode) {
	if (shapeGeoJson != null) {
		mapContainer.removeLayer(shapeGeoJson)
	}
	shp(LakeData[lakeId].browserPath).then((geojson: any) => {
		shapeGeoJson = L.geoJson(geojson)
		shapeGeoJson.addTo(mapContainer)
		mapContainer.fitBounds(shapeGeoJson.getBounds())
	})
}

export function addEETileLayer(lakeId: LakesCode, layerTypeToShow: EELayerType, indices: string, start: string, end: string) {
	let GETParams = new URLSearchParams()
	GETParams.append("AOIId", lakeId.toString())
	GETParams.append("tileType", layerTypeToShow.toString())
	GETParams.append("indices", indices)
	GETParams.append("startDate", start)
	GETParams.append("endDate", end)
	console.log(memoMapForTileUrls)

	if (memoMapForTileUrls.has(GETParams.toString())) {
		if (geeTileLayer != null) {
			mapContainer.removeLayer(geeTileLayer)
		}
		geeTileLayer = L.tileLayer(memoMapForTileUrls.get(GETParams.toString()), {
			maxZoom: 19,
			attribution: 'Map data &copy; <a href="https://www.google.com/earth/engine/">Google Earth Engine</a>'
		});
		geeTileLayer.addTo(mapContainer);
		return
	}

	fetch("/ee/tile?" + GETParams.toString()).then((data) => {
		data.json().then((val: TileResponseTypeAPI) => {
			memoMapForTileUrls.set(GETParams.toString(), val.urlFormat)
			if (geeTileLayer != null) {
				mapContainer.removeLayer(geeTileLayer)
			}
			geeTileLayer = L.tileLayer(val.urlFormat, {
				maxZoom: 19,
				attribution: 'Map data &copy; <a href="https://www.google.com/earth/engine/">Google Earth Engine</a>'
			});
			geeTileLayer.addTo(mapContainer);
		})
	})

}

export function getWaterData(lakeId: LakesCode, waterDataType: WaterDataType, indices: string, start: string, end: string) {
	let GETParams = new URLSearchParams()
	GETParams.append("AOIId", lakeId.toString())
	GETParams.append("waterDataType", waterDataType.toString())
	GETParams.append("indices", indices)
	GETParams.append("startDate", start)
	GETParams.append("endDate", end)

	fetch("/ee/data?" + GETParams.toString()).then((data) => {
		data.json().then((val) => {
			console.log(val.data)
		})
	})

}
