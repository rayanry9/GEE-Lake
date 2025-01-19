//@ts-ignore
import L from "leaflet"
//@ts-ignore
import shp from "shpjs"
import { EELayerType, IndicesData, LakeData, LakeCode, type EETileResponse } from "./mapData";
import { writable } from "svelte/store";

let mapContainer: any
let baseMapLayer: any
let shapeGeoJson: any
var geeTileLayer: null | any = null

let EEResponseTiles: EETileResponse
export const inputDisabledSidebar = writable(false)

let currentLayerType = $state<EELayerType>(EELayerType.FinalClassification)
export function setCurrentLayerType(type: EELayerType) {
	currentLayerType = type
}

let currentLakeId = $state<LakeCode>(LakeCode.Ammenpur)
export function setCurrentLakeId(id: LakeCode) {
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
		addEETileLayer(currentLakeId, JSON.stringify(indicesState), startDate, endDate)
	})
	$effect(() => {
		console.log("AA")
		changeEETileLayer(currentLayerType)
	})
}

export function addLakeShapeToMap(lakeId: LakeCode) {
	if (shapeGeoJson != null) {
		mapContainer.removeLayer(shapeGeoJson)
	}
	shp(LakeData[lakeId].browserPath).then((geojson: any) => {
		shapeGeoJson = L.geoJson(geojson)
		mapContainer.fitBounds(shapeGeoJson.getBounds())
		shapeGeoJson.addTo(mapContainer)
	})
}
function changeEETileLayer(currentLayerType: EELayerType) {
	if (EEResponseTiles == null || EEResponseTiles == undefined) {
		return
	}
	if (geeTileLayer != null) {
		mapContainer.removeLayer(geeTileLayer)
	}
	geeTileLayer = L.tileLayer(EEResponseTiles[currentLayerType].urlFormat, {
		maxZoom: 19,
		attribution: 'Map data &copy; <a href="https://www.google.com/earth/engine/">Google Earth Engine</a>'
	});
	geeTileLayer.addTo(mapContainer);
	inputDisabledSidebar.set(false)
}

function addEETileLayer(lakeId: LakeCode, indices: string, start: string, end: string) {
	let GETParams = new URLSearchParams()
	GETParams.append("AOIId", lakeId.toString())
	GETParams.append("indices", indices)
	GETParams.append("startDate", start)
	GETParams.append("endDate", end)

	fetch("/ee/tile?" + GETParams.toString()).then((data) => {
		data.json().then((val: EETileResponse) => {
			EEResponseTiles = val
			if (geeTileLayer != null) {
				mapContainer.removeLayer(geeTileLayer)
			}
			geeTileLayer = L.tileLayer(val[currentLayerType].urlFormat, {
				maxZoom: 19,
				attribution: 'Map data &copy; <a href="https://www.google.com/earth/engine/">Google Earth Engine</a>'
			});
			geeTileLayer.addTo(mapContainer);
			inputDisabledSidebar.set(false)
		})
	})

}
