import { LakeData, LakeCode, type EEResponseData } from "./mapData";
//@ts-ignore
import shp from "shpjs"
//@ts-ignore
import L from "leaflet"
import { acquiredFinalDate, acquiredStartDate, currentLakeId, dateChangeObs, EEResponseTileData, endDate, setEEResponseStatData, setEEResponseTileData, startDate } from "./mapState";
import { get } from "svelte/store";

export function createMap(container: HTMLElement): any {

	let mapContainer = L.map(container).setView([0, 0], 2);
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(mapContainer);

	L.control.scale({ position: 'bottomleft' }).addTo(mapContainer)
	return mapContainer
}

export async function addLakeShapeToMap(lakeId: LakeCode, mapContainer: any): Promise<any> {
	return new Promise((resolve, _) => {

		shp(LakeData[lakeId].browserPath).then((geojson: any) => {
			let shapeGeoJson = L.geoJson(geojson)
			mapContainer.fitBounds(shapeGeoJson.getBounds())
			shapeGeoJson.addTo(mapContainer)
			resolve(shapeGeoJson)
		})
	})
}


export function addEETileLayer(url: string, mapContainer: any) {
	if (EEResponseTileData == null || EEResponseTileData == undefined) {
		return
	}
	let geeTileLayer = L.tileLayer(url, {
		maxZoom: 19,
		attribution: 'Map data &copy; <a href="https://www.google.com/earth/engine/">Google Earth Engine</a>'
	});
	geeTileLayer.addTo(mapContainer);
	return geeTileLayer
}

export function updateEEData(lakeId: LakeCode, start: string, end: string) {
	let GETParams = new URLSearchParams()
	GETParams.append("AOIId", lakeId.toString())
	GETParams.append("startDate", start)
	GETParams.append("endDate", end)

	fetch("/ee/tile?" + GETParams.toString()).then((data) => {
		data.json().then((val: EEResponseData) => {
			setEEResponseTileData(val.tile)
			setEEResponseStatData(val.data)
			acquiredStartDate.set(new Date(val.satInitialDate).toDateString())
			acquiredFinalDate.set(new Date(val.satFinalDate).toDateString())

			currentLakeId.set(lakeId)
			startDate.set(start)
			endDate.set(end)
			dateChangeObs.set(!get(dateChangeObs))
		})
	})

}
