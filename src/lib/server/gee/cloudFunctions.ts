//@ts-ignore
import ee from "@google/earthengine"

export function cloudPercent2(AOI: any, image: any) {
	image = image.clip(AOI)
	let csum = ee.Number(image.select('MSK_CLDPRB').gt(1).reduceRegion({ reducer: ee.Reducer.sum(), geometry: AOI, maxPixels: 1e8, scale: 10 }).get('MSK_CLDPRB'));
	let totsum = ee.Number(image.select('MSK_CLDPRB').reduceRegion({ reducer: ee.Reducer.count(), geometry: AOI, maxPixels: 1e8, scale: 10 }).get('MSK_CLDPRB'));
	return image.set({ "cloud%": (csum.divide(totsum)).multiply(100) })
}

export function cloudPercentl5(AOI: any, image: any) {
	image = image.clip(AOI)
	let csum = ee.Number((image.select('QA_PIXEL').eq(5896).add(image.select('QA_PIXEL').eq(7440))).reduceRegion({ reducer: ee.Reducer.sum(), geometry: AOI, maxPixels: 1e8, scale: 30 }).get('QA_PIXEL'));
	let totsum = ee.Number(image.select('QA_PIXEL').reduceRegion({ reducer: ee.Reducer.count(), geometry: AOI, maxPixels: 1e8, scale: 10 }).get('QA_PIXEL'));
	return image.set({ "cloud%": (csum.divide(totsum)).multiply(100) })
}

export function cloudPercentl89(AOI: any, image: any) {
	image = image.clip(AOI)
	let csum = ee.Number((image.select('QA_PIXEL').eq(22280).add(image.select('QA_PIXEL').eq(23888)).add(image.select('QA_PIXEL').eq(55052))).reduceRegion({ reducer: ee.Reducer.sum(), geometry: AOI, maxPixels: 1e8, scale: 30 }).get('QA_PIXEL'));
	let totsum = ee.Number(image.select('QA_PIXEL').reduceRegion({ reducer: ee.Reducer.count(), geometry: AOI, maxPixels: 1e8, scale: 10 }).get('QA_PIXEL'));
	return image.set({ "cloud%": (csum.divide(totsum)).multiply(100) })
}

