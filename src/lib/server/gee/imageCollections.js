import ee from "@google/earthengine"
import { cloudCover, cloudCoverA, dateEnd, dateStart, endDate, getAOI, startDate } from "./inputs";
import { cloudPercent2, cloudPercentl5, cloudPercentl89 } from "./cloudFunctions";
import { applyScaleFactors, clipToAOI, s2scale } from "./utilFunctions";
import { addAWEInsh, addAWEIsh, addBSI, addmNDWI, addNDBI, addNDVI } from "./bandFunctions";

function getl5ImageCollection() {
	let AOI = getAOI()
	return ee.ImageCollection('LANDSAT/LT05/C02/T1_L2')
		.filterBounds(AOI)
		.filterDate(startDate, ee.Date('2015'))
		.filter(ee.Filter.lte('CLOUD_COVER', cloudCover))
		.map(cloudPercentl5).filter(ee.Filter.lt('cloud%', cloudCoverA))
		.select(['SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B7'], ['blue', 'green', 'red', 'nir', 'swirI', 'swirII'])
		.map(applyScaleFactors);
}

function getl8ImageCollection() {
	let AOI = getAOI()
	return ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
		.filterBounds(AOI)
		.filterDate(ee.Date('2011'), endDate)
		.filter(ee.Filter.lte('CLOUD_COVER', cloudCover))
		.map(cloudPercentl89).filter(ee.Filter.lt('cloud%', cloudCoverA))
		.select(['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'], ['blue', 'green', 'red', 'nir', 'swirI', 'swirII'])
		.map(applyScaleFactors);
}

function getl9ImageCollection() {
	let AOI = getAOI()
	return ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
		.filterBounds(AOI)
		.filterDate(ee.Date('2011'), endDate)
		.filter(ee.Filter.lte('CLOUD_COVER', cloudCover))
		.map(cloudPercentl89).filter(ee.Filter.lt('cloud%', cloudCoverA))
		.select(['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'], ['blue', 'green', 'red', 'nir', 'swirI', 'swirII'])
		.map(applyScaleFactors);
}

function gets2ImageCollection() {
	let AOI = getAOI()
	return ee.ImageCollection("COPERNICUS/S2_SR")
		.filterBounds(AOI)
		.filterDate(ee.Date('2017'), endDate)
		.filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', cloudCover))
		.map(cloudPercent2).filter(ee.Filter.lt('cloud%', cloudCoverA))
		.select(['B2', 'B3', 'B4', 'B8', 'B11', 'B12'], ['blue', 'green', 'red', 'nir', 'swirI', 'swirII']).map(s2scale);
}

function getCombinedCollection() {
	//return getl5ImageCollection().merge(getl8ImageCollection()).merge(getl9ImageCollection()).merge(gets2ImageCollection()).map(clipToAOI)
	return gets2ImageCollection().map(clipToAOI)
}
function getCombinedCollectionWithIndices() {
	return getCombinedCollection().map(addNDVI).map(addmNDWI).map(addAWEIsh).map(addAWEInsh).map(addNDBI).map(addBSI).sort('system:time_start')
}

function getUniqueDatesCollection() {
	return getCombinedCollectionWithIndices().aggregate_array('system:time_start')
		.map(function(date) {
			return ee.Date(date).format('YYYY-MM-dd');
		}).distinct()
}

export function getDailyMedianCollection() {
	return ee.ImageCollection.fromImages(
		getUniqueDatesCollection().map(function(date) {
			date = ee.String(date); // Ensure date is a string
			let filtered = getCombinedCollectionWithIndices().filter(ee.Filter.date(date, ee.Date(date).advance(1, 'day')));
			let median = filtered.mean(); // Compute median
			return median.set('system:time_start', ee.Date(date).millis()) // Retain the date
				.set('system:date', date); // Add a human-readable date property
		})
	)
}

function dailyMedianWithDifferenceStart() {
	return getDailyMedianCollection().map(function(image) {
		var diff = image.date().difference(dateStart, 'day').abs();
		return image.set('date_difference', diff);
	})
}

function dailyMedianWithDifferenceStop() {
	return getDailyMedianCollection().map(function(image) {
		var diff = image.date().difference(dateEnd, 'day').abs();
		return image.set('date_difference', diff);
	})
}

export function getStartImage() {
	return dailyMedianWithDifferenceStart().sort('date_difference').first()
}

export function getRecentImage() {
	return dailyMedianWithDifferenceStop().sort('date_difference').first()
}

