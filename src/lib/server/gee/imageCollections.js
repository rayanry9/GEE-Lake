import ee from "@google/earthengine"
import { cloudCover, cloudCoverA, endDate, getAOI, startDate } from "./inputs";
import { cloudPercent2, cloudPercentl5, cloudPercentl89 } from "./cloudFunctions";
import { applyScaleFactors, clipToAOI, s2scale } from "./utilFunctions";
import { addAWEInsh, addAWEIsh, addBSI, addmNDWI, addNDBI, addNDVI } from "./bandFunctions";


export function getl5ImageCollection() {
	let AOI = getAOI()
	return ee.ImageCollection('LANDSAT/LT05/C02/T1_L2')
		.filterBounds(AOI)
		.filterDate(startDate, ee.Date('2015'))
		.filter(ee.Filter.lte('CLOUD_COVER', cloudCover))
		.map(cloudPercentl5).filter(ee.Filter.lt('cloud%', cloudCoverA))
		.select(['SR_B1', 'SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B7'], ['blue', 'green', 'red', 'nir', 'swirI', 'swirII'])
		.map(applyScaleFactors);
}

export function getl8ImageCollection() {
	let AOI = getAOI()
	return ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
		.filterBounds(AOI)
		.filterDate(ee.Date('2011'), endDate)
		.filter(ee.Filter.lte('CLOUD_COVER', cloudCover))
		.map(cloudPercentl89).filter(ee.Filter.lt('cloud%', cloudCoverA))
		.select(['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'], ['blue', 'green', 'red', 'nir', 'swirI', 'swirII'])
		.map(applyScaleFactors);
}

export function getl9ImageCollection() {
	let AOI = getAOI()
	return ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
		.filterBounds(AOI)
		.filterDate(ee.Date('2011'), endDate)
		.filter(ee.Filter.lte('CLOUD_COVER', cloudCover))
		.map(cloudPercentl89).filter(ee.Filter.lt('cloud%', cloudCoverA))
		.select(['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'], ['blue', 'green', 'red', 'nir', 'swirI', 'swirII'])
		.map(applyScaleFactors);
}

export function gets2ImageCollection() {
	let AOI = getAOI()
	return ee.ImageCollection("COPERNICUS/S2_SR")
		.filterBounds(AOI)
		.filterDate(ee.Date('2017'), endDate)
		.filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', cloudCover))
		.map(cloudPercent2).filter(ee.Filter.lt('cloud%', cloudCoverA))
		.select(['B2', 'B3', 'B4', 'B8', 'B11', 'B12'], ['blue', 'green', 'red', 'nir', 'swirI', 'swirII']).map(s2scale);
}

export function getCombinedCollection() {
	return getl5ImageCollection().merge(getl8ImageCollection()).merge(getl9ImageCollection()).merge(gets2ImageCollection()).map(clipToAOI)
}
export function getCombinedCollectionWithIndices() {
	return getCombinedCollection().map(addNDVI).map(addmNDWI).map(addAWEIsh).map(addAWEInsh).map(addNDBI).map(addBSI).sort('system:time_start')
}


