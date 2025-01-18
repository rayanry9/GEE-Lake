import { getRecentImage, getStartImage } from "./imageCollections";

function classification(image: any) {
	return image.expression(
		// Conditions for classification
		'aweinsh >= -1.70 && aweinsh <= -0.57 && ndvi >= 0.17 && ndbi < 0.101 && red < 0.24 ? 2 : ' +
		'aweinsh < -1.70 && ndvi >= 0.25 ? 2 : ' +
		'aweinsh >= -1.70 && aweinsh <= -0.57 && ndvi < 0.17 && aweish >= -0.38 && aweish <= -0.30 && mndwi < -0.15 && swir_ii < 0.29 ? 3 : ' +
		'aweinsh < -1.70 && ndvi < 0.25 && aweish >= -0.35 && ndbi < 0.040 ? 3 : ' +
		'aweinsh >= -1.70 && aweinsh <= -0.57 && ndvi < 0.17 && aweish >= -0.38 && aweish <= -0.34 && mndwi < -0.15 && swir_ii >= 0.29 && swir_i >= 0.39 ? 3 : ' +
		'aweinsh >= -1.70 && aweinsh <= -0.57 && ndvi < 0.17 && aweish >= -0.30 && ndbi < -0.058 && blue < 0.29 ? 3 : ' +
		'aweinsh >= -1.70 && aweinsh <= -0.57 && ndvi >= 0.17 && ndbi < 0.101 && red >= 0.24 ? 3 : ' +
		'aweinsh >= -1.70 && aweinsh <= -0.57 && ndvi >= 0.17 && ndbi >= 0.101 ? 3 : ' +
		'aweinsh >= -1.70 && aweinsh <= -0.57 && ndvi < 0.17 && aweish < -0.38 ? 3 : ' +
		'aweinsh >= -1.70 && aweinsh <= -0.57 && ndvi < 0.17 && aweish >= -0.38 && aweish <= -0.30 && mndwi >= -0.15 ? 3 : ' +
		'aweinsh < -1.70 && ndvi < 0.25 && aweish < -0.35 ? 3 : ' +
		'aweinsh >= -1.70 && aweinsh <= -0.57 && ndvi < 0.17 && aweish >= -0.34 && aweish <= -0.30 && mndwi < -0.15 && swir_ii >= 0.29 && swir_i >= 0.39 ? 4 : ' +
		'aweinsh < -1.70 && ndvi < 0.25 && aweish >= -0.35 && ndbi >= 0.040 ? 4 : ' +
		'aweinsh >= -1.70 && aweinsh <= -0.57 && ndvi < 0.17 && aweish >= -0.38 && aweish <= -0.30 && mndwi < -0.15 && swir_ii >= 0.29 && swir_i < 0.39 ? 4 : ' +
		'aweinsh >= -1.70 && aweinsh <= -0.57 && ndvi < 0.17 && aweish >= -0.30 && ndbi >= -0.058 ? 4 : ' +
		'aweinsh >= -1.70 && aweinsh <= -0.57 && ndvi < 0.17 && aweish >= -0.30 && ndbi < -0.058 && blue >= 0.29 ? 4 : ' +
		'aweinsh >= -0.57 ? 5 : 1', // Default class 1 if no condition is met
		{
			aweinsh: image.select("AWEInsh"),  // Replace with the actual aweinsh band or calculation
			aweish: image.select("AWEIsh"),    // Replace with the actual aweish band or calculation
			ndvi: image.select("ndvi"),
			mndwi: image.select("mndwi"),      // Use the correct mndwi band
			ndbi: image.select("ndbi"),        // Ensure you use the correct ndbi band
			red: image.select("red"),          // Red band
			blue: image.select("blue"),        // Blue band
			swir_ii: image.select("swirII"),  // SWIR II band
			swir_i: image.select("swirI")     // SWIR I band
		}
	).rename('class')
		.set("system:time_start", image.get('system:time_start'));
}

export function getInitialClassification(AOI: any, startDateUser: string, endDate: any, cloudCover: number, cloudCoverUser: number, indices: string) {
	return classification(getStartImage(AOI, startDateUser, endDate, cloudCover, cloudCoverUser, indices)).clip(AOI)
}

export function getFinalClassification(AOI: any, endDateUser: string, endDate: any, cloudCover: number, cloudCoverUser: number, indices: string) {
	return classification(getRecentImage(AOI, endDateUser, endDate, cloudCover, cloudCoverUser, indices)).clip(AOI)
}

export function getFromWaterImage(AOI: any, startDateUser: string, endDateUser: string, endDate: any, cloudCover: number, cloudCoverUser: any, indices: string) {
	let initialClass5 = getInitialClassification(AOI, startDateUser, endDate, cloudCover, cloudCoverUser, indices)
	initialClass5 = initialClass5.updateMask(initialClass5.eq(5))
	let finalNotClass5 = getFinalClassification(AOI, endDateUser, endDate, cloudCover, cloudCoverUser, indices)
	finalNotClass5 = finalNotClass5.updateMask(finalNotClass5.neq(5))
	return initialClass5.and(finalNotClass5)
}

export function getToWaterImage(AOI: any, startDateUser: string, endDateUser: string, endDate: any, cloudCover: number, cloudCoverUser: any, indices: string) {

	let initialNotClass5 = getInitialClassification(AOI, startDateUser, endDate, cloudCover, cloudCoverUser, indices)
	initialNotClass5 = initialNotClass5.updateMask(initialNotClass5.neq(5))
	let finalClass5 = getFinalClassification(AOI, endDateUser, endDate, cloudCover, cloudCoverUser, indices)
	finalClass5 = finalClass5.updateMask(finalClass5.eq(5))

	return initialNotClass5.and(finalClass5)
}
