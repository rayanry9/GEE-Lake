//@ts-ignore
import L from "leaflet"
//@ts-ignore
import shp from "shpjs"
import { LakeData } from "./mapData";

let map: any

export function createMap(container: HTMLElement) {

	map = L.map(container).setView([0, 0], 2);

	let baseMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);
	L.control.scale({ position: 'bottomleft' }).addTo(map)
	/*
	let baseMap = L.tileLayer('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png ', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);
	*/
	let id = 0

	shp(LakeData[id].browserPath).then((geojson: any) => {
		var mapGeoJson = L.geoJson(geojson)
		mapGeoJson.addTo(map)
		map.fitBounds(mapGeoJson.getBounds())
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
	return map
}
