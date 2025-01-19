import { LakeCode, LakeData, LayerType, type EELayer, type EETileResponse } from "$lib/mapData";
import { Console } from "../consoleColors";
import { classification } from "./classification";
import { getCollectionWithIndices, getDailyMedianCollection, getDailyMedianWithDifferenceStart, getDailyMedianWithDifferenceStop, getRecentImage, gets2ImageCollection, getStartImage, getUniqueDatesCollection } from "./imageCollections";
import { initGEE } from "./init";
import { dataVisParams, rgbVisParams } from "./visParams";
//@ts-ignore
import ee from "@google/earthengine"

function getMapId(image: any, visParams: any): Promise<any> {
	return new Promise((resolve, reject) => {
		image.getMapId(visParams, (obj: any) => {
			if (obj == undefined || obj == null) {
				reject(new Error("Could not get computed Image"))
			}
			resolve(obj)
		})
	})
}
function getInfo(number: any): Promise<any> {
	return new Promise((resolve, reject) => {

		number.getInfo((obj: any) => {
			if (obj == undefined || obj == null) {
				reject(new Error("Could not get computed Image"))
			}
			resolve(obj)
		})
	})
}

export async function getAllFormatUrls(AOIcode: LakeCode, startDateUser: string, endDateUser: string, cloudCover: number, cloudCoverUser: number, indices: string): Promise<EETileResponse | null> {

	let responseData: EETileResponse = new Array<EELayer>
	let AOI: any

	try {
		AOI = ee.FeatureCollection(LakeData[AOIcode].geeAssetPath)
	} catch (e: any) {
		if ((e.message as string).match("Request is missing required authentication credential. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project.")) {
			Console.error("Google Earth Engine Not Authenticated")

			let geeAuthStatus = await initGEE()
			if (!geeAuthStatus) {
				return null
			}
			AOI = ee.FeatureCollection(LakeData[AOIcode].geeAssetPath)
		}

	}
	let endDate = ee.Date(new Date()).advance(1, 'day');

	let s2Img = gets2ImageCollection(AOI, endDate, cloudCover, cloudCoverUser)
	let collectionImgWithIndices = getCollectionWithIndices(s2Img, indices)
	let uniqDatesCollectionImg = getUniqueDatesCollection(collectionImgWithIndices)
	let dailyMedianCollectionImg = getDailyMedianCollection(uniqDatesCollectionImg, collectionImgWithIndices)
	let dailyMedianDiffStartCollectionImg = getDailyMedianWithDifferenceStart(dailyMedianCollectionImg, startDateUser)
	let dailyMedianDiffStopCollectionImg = getDailyMedianWithDifferenceStop(dailyMedianCollectionImg, endDateUser)

	let startImage = getStartImage(dailyMedianDiffStartCollectionImg)
	let recentImage = getRecentImage(dailyMedianDiffStopCollectionImg)
	let initialClassifcation = classification(startImage).clip(AOI)
	let finalClassifcation = classification(recentImage).clip(AOI)

	let initialNotClass5 = initialClassifcation.updateMask(initialClassifcation.neq(5))
	let finalClass5 = finalClassifcation.updateMask(finalClassifcation.eq(5))
	let toWater = initialNotClass5.and(finalClass5)

	let initialClass5 = initialClassifcation.updateMask(initialClassifcation.eq(5))
	let finalNotClass5 = finalClassifcation.updateMask(finalClassifcation.neq(5))
	let fromWater = initialClass5.and(finalNotClass5)

	let allData = await Promise.all([
		getMapId(finalClassifcation, dataVisParams),
		getMapId(initialClassifcation, dataVisParams),
		getMapId(startImage, rgbVisParams),
		getMapId(recentImage, rgbVisParams),
		getMapId(fromWater, { min: 0, max: 1, palette: ['red'] }),
		getMapId(toWater, { min: 0, max: 1, palette: ['green'] }),
		getInfo(ee.Number(fromWater.reduceRegion({ reducer: ee.Reducer.count(), geometry: AOI, scale: 10, maxPixels: 1e23 }).get('class')).multiply(0.01)),
		getInfo(ee.Number(toWater.reduceRegion({ reducer: ee.Reducer.count(), geometry: AOI, scale: 10, maxPixels: 1e23 }).get('class')).multiply(0.01))
	])

	allData.forEach((element, idx) => {
		if (idx < LayerType.length) {
			responseData.push({
				type: idx,
				lake: AOIcode,
				urlFormat: element.urlFormat,
				data: null
			} satisfies EELayer)
		} else {
			responseData[idx - 2].data = element
		}
	});
	return responseData
}
