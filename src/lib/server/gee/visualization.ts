import { getFinalClassification, getInitialClassification } from "./classification";
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
