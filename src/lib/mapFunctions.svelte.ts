//@ts-ignore
import L from "leaflet"
//@ts-ignore
import shp from "shpjs"
import { EETileLayerType, LakeData } from "./mapData.svelte";
import type { TileResponseType } from "../routes/ee/tile/+server";

let mapContainer: any
let baseMapLayer
let shapeGeoJson
var geeTileLayer: null | any = null
let currentLakeId = $state(0)
let currentTileLayerToShow = $state<EETileLayerType>(EETileLayerType.FinalClassification)

export function createMap(container: HTMLElement) {

	mapContainer = L.map(container).setView([0, 0], 2);

	baseMapLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(mapContainer);
	L.control.scale({ position: 'bottomleft' }).addTo(mapContainer)

	$effect(() => {
		addLakeShapeToMap(currentLakeId)
	})
	$effect(() => {
		addEETileLayer(currentLakeId, currentTileLayerToShow)
	})

	/*
	let baseMap = L.tileLayer('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png ', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);
	*/

	/*
	shp(LakeData[id].browserPath).then((geojson: any) => {
		var mapGeoJson = L.geoJson(geojson)
		mapGeoJson.addTo(map)
		map.fitBounds(mapGeoJson.getBounds())
		/*
		fetch("/ee/tile?AOIId=" + id).then((data) => {
			data.json().then((val) => {

				var geeTileLayer = L.tileLayer(val.url_format, {
					maxZoom: 19,
					attribution: 'Map data &copy; <a href="https://www.google.com/earth/engine/">Google Earth Engine</a>'
				});
				geeTileLayer.addTo(map);
			})
		})
	})
		*/
}

export function addLakeShapeToMap(lakeId: number) {
	shp(LakeData[lakeId].browserPath).then((geojson: any) => {
		shapeGeoJson = L.geoJson(geojson)
		shapeGeoJson.addTo(mapContainer)
		mapContainer.fitBounds(shapeGeoJson.getBounds())
	})
}

export function addEETileLayer(lakeId: number, tileTypeToShow: EETileLayerType) {
	fetch("/ee/tile?AOIId=" + lakeId + "&tileType=" + tileTypeToShow).then((data) => {
		data.json().then((val: TileResponseType) => {
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
