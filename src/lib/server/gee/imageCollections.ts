//@ts-ignore
import ee from "@google/earthengine"
import { cloudPercent2, cloudPercentl5, cloudPercentl89 } from "./cloudFunctions";
import { applyScaleFactors, clipToAOI, s2scale } from "./utilFunctions";
import { addAWEInsh, addAWEIsh, addBSI, addmNDWI, addNDBI, addNDVI } from "./bandFunctions";
//import { IndicesCode } from "$lib/mapData";
//import { Console } from "../consoleColors";

export function getl5ImageCollection(AOI: any, startDate: string, cloudCover: number, cloudCoverUser: number): any {
	return ee.ImageCollection('LANDSAT/LT05/C02/T1_L2')
		.filterBounds(AOI)
		.filterDate(startDate, ee.Date('2015'))
		.filter(ee.Filter.lte('CLOUD_COVER', cloudCover))
		.map((image: any) => { return cloudPercentl5(AOI, image) }).filter(ee.Filter.lt('cloud%', cloudCoverUser))
		.select(['SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B7'], ['blue', 'green', 'red', 'nir', 'swirI', 'swirII'])
		.map(applyScaleFactors);
}

export function getl8ImageCollection(AOI: any, endDate: string, cloudCover: number, cloudCoverUser: number) {

	return ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
		.filterBounds(AOI)
		.filterDate(ee.Date('2011'), endDate)
		.filter(ee.Filter.lte('CLOUD_COVER', cloudCover))
		.map((image: any) => cloudPercentl89(AOI, image)).filter(ee.Filter.lt('cloud%', cloudCoverUser))
		.select(['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'], ['blue', 'green', 'red', 'nir', 'swirI', 'swirII'])
		.map(applyScaleFactors);
}

export function getl9ImageCollection(AOI: any, endDate: any, cloudCover: number, cloudCoverUser: number) {
	return ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
		.filterBounds(AOI)
		.filterDate(ee.Date('2011'), endDate)
		.filter(ee.Filter.lte('CLOUD_COVER', cloudCover))
		.map((image: any) => cloudPercentl89(AOI, image)).filter(ee.Filter.lt('cloud%', cloudCoverUser))
		.select(['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'], ['blue', 'green', 'red', 'nir', 'swirI', 'swirII'])
		.map(applyScaleFactors);
}

export function gets2ImageCollection(AOI: any, endDate: any, cloudCover: number, cloudCoverUser: number) {

	//Console.info("Retrieved S2 Sat Image")

	return ee.ImageCollection("COPERNICUS/S2_SR")
		.filterBounds(AOI)
		.filterDate(ee.Date('2017'), endDate)
		.filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', cloudCover))
		.map((image: any) => cloudPercent2(AOI, image)).filter(ee.Filter.lt('cloud%', cloudCoverUser))
		.select(['B2', 'B3', 'B4', 'B8', 'B11', 'B12'], ['blue', 'green', 'red', 'nir', 'swirI', 'swirII'])
		.map(s2scale)
		.map((image: any) => clipToAOI(AOI, image))
}

//export function getCollectionWithIndices(s2Img: any, indices: string) {
export function getCollectionWithIndices(s2Img: any) {

	//Console.info("Added Bands to Collection");

	/*
	(JSON.parse(indices) as Array<Boolean>).forEach((val, idx) => {
		idx = idx as IndicesCode
		if (val) {
			switch (idx) {
				case IndicesCode.NDVI:
					s2Img = s2Img.map(addNDVI)
					break
				case IndicesCode.mNDWI:
					s2Img = s2Img.map(addmNDWI)
					break
				case IndicesCode.AWEIsh:
					s2Img = s2Img.map(addAWEIsh)
					break
				case IndicesCode.AWEInsh:
					s2Img = s2Img.map(addAWEInsh)
					break
				case IndicesCode.NDBI:
					s2Img = s2Img.map(addNDBI)
					break
				case IndicesCode.BSI:
					s2Img = s2Img.map(addBSI)
					break
			}
		}
	})
	*/
	s2Img = s2Img.map(addNDVI).map(addmNDWI).map(addAWEIsh).map(addAWEInsh).map(addNDBI).map(addBSI)
	return s2Img.sort('system:time_start')
}

export function getUniqueDatesCollection(collectionImgWithIndices: any) {

	//Console.info("Filtering Collection by Unique Dates");

	return collectionImgWithIndices.aggregate_array('system:time_start')
		.map(function(date: any) {
			return ee.Date(date).format('YYYY-MM-dd');
		}).distinct()
}

export function getDailyMedianCollection(uniqDatesCollectionImg: any, collectionImgWithIndices: any) {

	//Console.info("Getting Daily Median From Collection");

	return ee.ImageCollection.fromImages(
		uniqDatesCollectionImg.map(function(date: any) {
			date = ee.String(date); // Ensure date is a string
			let filtered = collectionImgWithIndices.filter(ee.Filter.date(date, ee.Date(date).advance(1, 'day')));
			let median = filtered.mean(); // Compute median
			return median.set('system:time_start', ee.Date(date).millis()) // Retain the date
				.set('system:date', date); // Add a human-readable date property
		})
	)
}

export function getDailyMedianWithDifferenceStart(dailyMedianCollectionImg: any, startDateUser: string) {

	//Console.info("Getting Start Daily Median Difference");

	return dailyMedianCollectionImg.map(function(image: any) {
		let diff = image.date().difference(startDateUser, 'day').abs();
		return image.set('date_difference', diff);
	})
}

export function getDailyMedianWithDifferenceStop(dailyMedianCollectionImg: any, endDateUser: string) {

	//Console.info("Getting Stop Daily Median Difference");

	return dailyMedianCollectionImg.map(function(image: any) {
		let diff = image.date().difference(endDateUser, 'day').abs();
		return image.set('date_difference', diff);
	})
}

export function getStartImage(dailyMedianWithDiffStartCollectionImg: any) {

	//Console.info("Getting Start Image");

	return dailyMedianWithDiffStartCollectionImg.sort('date_difference').first()
}

export function getRecentImage(dailyMedianWithDiffStopCollectionImg: any) {

	//Console.info("Getting Recent Image");

	return dailyMedianWithDiffStopCollectionImg.sort('date_difference').first()
}
