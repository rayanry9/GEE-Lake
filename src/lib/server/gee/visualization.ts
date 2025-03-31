import { type EEStat, LakeCode, LakeData, type EEResponseData } from "$lib/mapData";
import { Console } from "../consoleColors";
import { classification } from "./classification";
import { getCollectionWithIndices, getDailyMedianCollection, getDailyMedianWithDifferenceStart, getDailyMedianWithDifferenceStop, getRecentImage, gets2ImageCollection, getStartImage, getUniqueDatesCollection } from "./imageCollections";
import { initGEE } from "./init";
import { calculateAreaChange, calculateClassAreas } from "./utilFunctions";
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

export async function getAllFormatUrls(AOIcode: LakeCode, startDateUser: string, endDateUser: string, cloudCover: number, cloudCoverUser: number): Promise<EEResponseData | null> {

	let responseData: EEResponseData = {
		tile: new Array<Array<string>>(4),
		data: new Array<EEStat>(),
		satInitialDate: "",
		satFinalDate: ""
	}
	responseData.tile[0] = new Array<string>()
	responseData.tile[1] = new Array<string>()
	responseData.tile[2] = new Array<string>()
	responseData.tile[3] = new Array<string>()
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
	//let collectionImgWithIndices = getCollectionWithIndices(s2Img, indices)
	let collectionImgWithIndices = getCollectionWithIndices(s2Img)
	let uniqDatesCollectionImg = getUniqueDatesCollection(collectionImgWithIndices)
	let dailyMedianCollectionImg = getDailyMedianCollection(uniqDatesCollectionImg, collectionImgWithIndices)
	let dailyMedianDiffStartCollectionImg = getDailyMedianWithDifferenceStart(dailyMedianCollectionImg, startDateUser)
	let dailyMedianDiffStopCollectionImg = getDailyMedianWithDifferenceStop(dailyMedianCollectionImg, endDateUser)

	let startImage = getStartImage(dailyMedianDiffStartCollectionImg)
	let recentImage = getRecentImage(dailyMedianDiffStopCollectionImg)
	let initialClassification = classification(startImage).clip(AOI)
	let finalClassification = classification(recentImage).clip(AOI)

	let initialNotClass5 = initialClassification.updateMask(initialClassification.neq(5))
	let finalClass5 = finalClassification.updateMask(finalClassification.eq(5))
	let toWater = initialNotClass5.and(finalClass5)
	let initialClass5 = initialClassification.updateMask(initialClassification.eq(5))
	let finalNotClass5 = finalClassification.updateMask(finalClassification.neq(5))
	let fromWater = initialClass5.and(finalNotClass5)


	let initialDate = ee.Date(initialClassification.get('system:time_start')).format('YYYY-MM-dd');
	let finalDate = ee.Date(finalClassification.get('system:time_start')).format('YYYY-MM-dd');

	let initialClassArea = calculateClassAreas(initialClassification, AOI, 10)
	let finalClassArea = calculateClassAreas(finalClassification, AOI, 10)

	let changeInArea = calculateAreaChange(initialClassArea, finalClassArea)

	let allData: any[] = []

	Console.task("Started Computing Images Google Earth Engine")
	try {
		allData = await Promise.all([
			getMapId(finalClassification.updateMask(finalClassification.select('class').eq(2)), dataVisParams),
			getMapId(finalClassification.updateMask(finalClassification.select('class').eq(3)), dataVisParams),
			getMapId(finalClassification.updateMask(finalClassification.select('class').eq(4)), dataVisParams),
			getMapId(finalClassification.updateMask(finalClassification.select('class').eq(5)), dataVisParams),
			getMapId(initialClassification.updateMask(initialClassification.select('class').eq(2)), dataVisParams),
			getMapId(initialClassification.updateMask(initialClassification.select('class').eq(3)), dataVisParams),
			getMapId(initialClassification.updateMask(initialClassification.select('class').eq(4)), dataVisParams),
			getMapId(initialClassification.updateMask(initialClassification.select('class').eq(5)), dataVisParams),
			getMapId(startImage, rgbVisParams),
			getMapId(recentImage, rgbVisParams),
			getMapId(fromWater, { min: 0, max: 1, palette: ['red'] }),
			getMapId(toWater, { min: 0, max: 1, palette: ['green'] }),
			//getInfo(ee.Number(fromWater.reduceRegion({ reducer: ee.Reducer.count(), geometry: AOI, scale: 10, maxPixels: 1e23 }).get('class')).multiply(0.01)),
			//getInfo(ee.Number(toWater.reduceRegion({ reducer: ee.Reducer.count(), geometry: AOI, scale: 10, maxPixels: 1e23 }).get('class')).multiply(0.01))
			getInfo(initialClassArea),
			getInfo(finalClassArea),
			getInfo(changeInArea),
			getInfo(initialDate),
			getInfo(finalDate)
		])

		console.log(responseData)

		allData.forEach((element, idx) => {
			if (idx == 16) {
				responseData.satFinalDate = element
			} else if (idx == 15) {
				responseData.satInitialDate = element
			} else if (idx < 15 && idx >= 12) {
				responseData.data.push({
					building: element["building"] as number,
					soil: element["soil"] as number,
					treeCover: element["treeCover"] as number,
					waterBody: element["waterBody"] as number
				})

			} else if (idx < 12 && idx >= 10) {
				responseData.tile[3].push(element.urlFormat)
			} else if (idx < 10 && idx >= 8) {
				responseData.tile[2].push(element.urlFormat)
			} else if (idx < 8 && idx >= 4) {
				responseData.tile[1].push(element.urlFormat)
			}
			else if (idx < 4) {
				responseData.tile[0].push(element.urlFormat)
			}
		});


		Console.success("Google Earth Engine Images Computed")
	} catch (e) {
		console.log(e)
		Console.error("Google Earth Engine could not compute any/all of the images")
		return null
	}
	return responseData
}
