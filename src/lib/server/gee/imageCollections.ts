//@ts-ignore
import ee from "@google/earthengine"
import { cloudPercent2, cloudPercentl5, cloudPercentl89 } from "./cloudFunctions";
import { applyScaleFactors, clipToAOI, s2scale } from "./utilFunctions";
import { addAWEInsh, addAWEIsh, addBSI, addmNDWI, addNDBI, addNDVI } from "./bandFunctions";

function getl5ImageCollection(AOI: any, startDate: string, cloudCover: number, cloudCoverUser: number): any {
	return ee.ImageCollection('LANDSAT/LT05/C02/T1_L2')
		.filterBounds(AOI)
		.filterDate(startDate, ee.Date('2015'))
		.filter(ee.Filter.lte('CLOUD_COVER', cloudCover))
		.map((image: any) => { return cloudPercentl5(AOI, image) }).filter(ee.Filter.lt('cloud%', cloudCoverUser))
		.select(['SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B7'], ['blue', 'green', 'red', 'nir', 'swirI', 'swirII'])
		.map(applyScaleFactors);
}

function getl8ImageCollection(AOI: any, endDate: string, cloudCover: number, cloudCoverUser: number) {
	return ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
		.filterBounds(AOI)
		.filterDate(ee.Date('2011'), endDate)
		.filter(ee.Filter.lte('CLOUD_COVER', cloudCover))
		.map((image: any) => cloudPercentl89(AOI, image)).filter(ee.Filter.lt('cloud%', cloudCoverUser))
		.select(['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'], ['blue', 'green', 'red', 'nir', 'swirI', 'swirII'])
		.map(applyScaleFactors);
}

function getl9ImageCollection(AOI: any, endDate: any, cloudCover: number, cloudCoverUser: number) {
	return ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
		.filterBounds(AOI)
		.filterDate(ee.Date('2011'), endDate)
		.filter(ee.Filter.lte('CLOUD_COVER', cloudCover))
		.map((image: any) => cloudPercentl89(AOI, image)).filter(ee.Filter.lt('cloud%', cloudCoverUser))
		.select(['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'], ['blue', 'green', 'red', 'nir', 'swirI', 'swirII'])
		.map(applyScaleFactors);
}

function gets2ImageCollection(AOI: any, endDate: any, cloudCover: number, cloudCoverUser: number) {
	return ee.ImageCollection("COPERNICUS/S2_SR")
		.filterBounds(AOI)
		.filterDate(ee.Date('2017'), endDate)
		.filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', cloudCover))
		.map((image: any) => cloudPercent2(AOI, image)).filter(ee.Filter.lt('cloud%', cloudCoverUser))
		.select(['B2', 'B3', 'B4', 'B8', 'B11', 'B12'], ['blue', 'green', 'red', 'nir', 'swirI', 'swirII']).map(s2scale);
}

function getCombinedCollection(AOI: any, endDate: any, cloudCover: number, cloudCoverUser: number) {
	//return getl5ImageCollection().merge(getl8ImageCollection()).merge(getl9ImageCollection()).merge(gets2ImageCollection()).map(clipToAOI)
	return gets2ImageCollection(AOI, endDate, cloudCover, cloudCoverUser).map((image: any) => clipToAOI(AOI, image))
}
function getCombinedCollectionWithIndices(AOI: any, endDate: any, cloudCover: number, cloudCoverUser: number) {

	return getCombinedCollection(AOI, endDate, cloudCover, cloudCoverUser).map(addNDVI).map(addmNDWI).map(addAWEIsh).map(addAWEInsh).map(addNDBI).map(addBSI).sort('system:time_start')
}

function getUniqueDatesCollection(AOI: any, endDate: any, cloudCover: number, cloudCoverUser: number) {
	return getCombinedCollectionWithIndices(AOI, endDate, cloudCover, cloudCoverUser).aggregate_array('system:time_start')
		.map(function(date: any) {
			return ee.Date(date).format('YYYY-MM-dd');
		}).distinct()
}

export function getDailyMedianCollection(AOI: any, endDate: any, cloudCover: number, cloudCoverUser: number) {
	return ee.ImageCollection.fromImages(
		getUniqueDatesCollection(AOI, endDate, cloudCover, cloudCoverUser).map(function(date: any) {
			date = ee.String(date); // Ensure date is a string
			let filtered = getCombinedCollectionWithIndices(AOI, endDate, cloudCover, cloudCoverUser).filter(ee.Filter.date(date, ee.Date(date).advance(1, 'day')));
			let median = filtered.mean(); // Compute median
			return median.set('system:time_start', ee.Date(date).millis()) // Retain the date
				.set('system:date', date); // Add a human-readable date property
		})
	)
}

function dailyMedianWithDifferenceStart(AOI: any, startDateUser: string, endDate: any, cloudCover: number, cloudCoverUser: number) {
	return getDailyMedianCollection(AOI, endDate, cloudCover, cloudCoverUser).map(function(image: any) {
		var diff = image.date().difference(startDateUser, 'day').abs();
		return image.set('date_difference', diff);
	})
}

function dailyMedianWithDifferenceStop(AOI: any, endDateUser: string, endDate: any, cloudCover: number, cloudCoverUser: number) {
	return getDailyMedianCollection(AOI, endDate, cloudCover, cloudCoverUser).map(function(image: any) {
		var diff = image.date().difference(endDateUser, 'day').abs();
		return image.set('date_difference', diff);
	})
}

export function getStartImage(AOI: any, startDateUser: string, endDate: any, cloudCover: number, cloudCoverUser: number) {
	return dailyMedianWithDifferenceStart(AOI, startDateUser, endDate, cloudCover, cloudCoverUser).sort('date_difference').first()
}

export function getRecentImage(AOI: any, endDateUser: string, endDate: any, cloudCover: number, cloudCoverUser: number) {
	return dailyMedianWithDifferenceStop(AOI, endDateUser, endDate, cloudCover, cloudCoverUser).sort('date_difference').first()
}
