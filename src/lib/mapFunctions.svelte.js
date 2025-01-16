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
		fetch("/ee").then((data) => {
			data.json().then((val) => {

				var geeTileLayer = L.tileLayer(val.url_format, {
					maxZoom: 19,
					attribution: 'Map data &copy; <a href="https://www.google.com/earth/engine/">Google Earth Engine</a>'
				});
				geeTileLayer.addTo(map);
				var mapGeoJson = L.geoJson(geojson)
				map.fitBounds(mapGeoJson.getBounds())
				mapGeoJson.addTo(map)

			})
		})
	})
	return map
}
