import { getFinalClassification, getFromWaterImage, getInitialClassification, getToWaterImage } from "./classification";
import { getRecentImage, getStartImage } from "./imageCollections";
import { dataVisParams, rgbVisParams } from "./visParams";
//@ts-ignore
import ee from "@google/earthengine"

export function getStartImgFormatUrl(AOIurl: string, startDateUser: string, cloudCover: number, cloudCoverUser: number, indices: string) {
	let AOI = ee.FeatureCollection(AOIurl)
	let endDate = ee.Date(new Date()).advance(1, 'day');

	return getStartImage(AOI, startDateUser, endDate, cloudCover, cloudCoverUser, indices).getMapId(rgbVisParams).urlFormat
}

export function getInitialClassificationFormatUrl(AOIurl: string, startDateUser: string, cloudCover: number, cloudCoverUser: number, indices: string) {
	let AOI = ee.FeatureCollection(AOIurl)
	let endDate = ee.Date(new Date()).advance(1, 'day');

	return getInitialClassification(AOI, startDateUser, endDate, cloudCover, cloudCoverUser, indices).getMapId(dataVisParams).urlFormat
}

export function getRecentImgFormatUrl(AOIurl: string, endDateUser: string, cloudCover: number, cloudCoverUser: number, indices: string) {
	let AOI = ee.FeatureCollection(AOIurl)
	let endDate = ee.Date(new Date()).advance(1, 'day');

	return getRecentImage(AOI, endDateUser, endDate, cloudCover, cloudCoverUser, indices).getMapId(rgbVisParams).urlFormat
}

export function getFinalClassificationFormatUrl(AOIurl: string, endDateUser: string, cloudCover: number, cloudCoverUser: number, indices: string) {
	let AOI = ee.FeatureCollection(AOIurl)
	let endDate = ee.Date(new Date()).advance(1, 'day');

	return getFinalClassification(AOI, endDateUser, endDate, cloudCover, cloudCoverUser, indices).getMapId(dataVisParams).urlFormat
}

export function getFromWaterFormatUrl(AOIurl: string, startDateUser: string, endDateUser: string, cloudCover: number, cloudCoverUser: number, indices: string) {
	let AOI = ee.FeatureCollection(AOIurl)
	let endDate = ee.Date(new Date()).advance(1, 'day');

	return getFromWaterImage(AOI, startDateUser, endDateUser, endDate, cloudCover, cloudCoverUser, indices).getMapId({ min: 0, max: 1, palette: ['red'] }).urlFormat
}

export function getToWaterFormatUrl(AOIurl: string, startDateUser: string, endDateUser: string, cloudCover: number, cloudCoverUser: number, indices: string) {
	let AOI = ee.FeatureCollection(AOIurl)
	let endDate = ee.Date(new Date()).advance(1, 'day');

	return getToWaterImage(AOI, startDateUser, endDateUser, endDate, cloudCover, cloudCoverUser, indices).getMapId({ min: 0, max: 1, palette: ['green'] }).urlFormat
}

export function getFromWaterData(AOIurl: string, startDateUser: string, endDateUser: string, cloudCover: number, cloudCoverUser: number, indices: string) {
	let AOI = ee.FeatureCollection(AOIurl)
	let endDate = ee.Date(new Date()).advance(1, 'day');

	return ee.Number(getFromWaterImage(AOI, startDateUser, endDateUser, endDate, cloudCover, cloudCoverUser, indices).reduceRegion({ reducer: ee.Reducer.count(), geometry: AOI, scale: 10, maxPixels: 1e23 }).get('class')).multiply(0.01).getInfo()
}

export function getToWaterData(AOIurl: string, startDateUser: string, endDateUser: string, cloudCover: number, cloudCoverUser: number, indices: string) {
	let AOI = ee.FeatureCollection(AOIurl)
	let endDate = ee.Date(new Date()).advance(1, 'day');
	return ee.Number(getToWaterImage(AOI, startDateUser, endDateUser, endDate, cloudCover, cloudCoverUser, indices).reduceRegion({ reducer: ee.Reducer.count(), geometry: AOI, scale: 10, maxPixels: 1e23 }).get('class')).multiply(0.01).getInfo()
}
