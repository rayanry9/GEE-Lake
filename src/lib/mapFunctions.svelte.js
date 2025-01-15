import L from "leaflet"
import shp from "shpjs"
let map

export function createMap(container) {
	map = L.map(container).setView([0, 0], 2);
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	shp("/Ameenpur_Lake_shapefile.zip").then((geojson) => {
		map.fitBounds(L.geoJson(geojson).getBounds())
		L.geoJson(geojson).addTo(map)
		console.log(geojson)
	})

	/*
	fetch("/ee").then((data) => {
		data.json().then((val) => {
			console.log(val.bounds)
			/*
			map.fitBounds([
				[val.bounds.getSouth(), val.bounds.getWest()],
				[val.bounds.getNorth(), val.bounds.getEast()]
			])


	L.imageOverlay(val.url_format, [val.bounds.coordinates()[1], val.bounds.coordinates()[0]]).addTo(map)
})
	})
	
	*/

	return map
}


export function createMap2(container) {
	map = L.map(container).setView([0, 0], 2);
	fetch("/ee").then((data) => {
		data.json().then((val) => {
			L.tileLayer(val.url_format, {
				maxZoom: 19,
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			}).addTo(map);
		})
	})

	return map
}
