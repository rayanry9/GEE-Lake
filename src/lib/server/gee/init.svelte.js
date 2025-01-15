import ee from "@google/earthengine"
import privateKey from "$lib/../../PRIVATE_KEY.json"
import { writable } from "svelte/store"

export const isInitiazlized = writable(false)

var roi
var image


var visParams = {
	bands: ['temperature_2m'],
	min: 229,
	max: 304,
	palette: ['#000004', '#410967', '#932567', '#f16e43', '#fcffa4']
};

ee.data.authenticateViaPrivateKey(privateKey,
	() => {
		ee.initialize(null, null, () => {
			isInitiazlized.set(true)
			roi = ee.Geometry.Point([-122.0838, 37.4220])
			image = ee.ImageCollection('ECMWF/ERA5_LAND/MONTHLY_AGGR')
				.filterDate('2023-01-01', '2023-02-01')
				.first();
			console.log(image.getMapId())
		})
	},
	(e) => {
		console.error("Authentication Error: " + e)
	}
)

export function getBounds() {
	return roi
}
export function getUrlFormat() {
	return image.getMap(visParams).urlFormat
}

