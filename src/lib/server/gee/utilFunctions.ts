//@ts-ignore
import ee from "@google/earthengine"
export function s2scale(image: any) {
	return image.divide(10000).copyProperties(image, ["system:time_start"]);
}

export function applyScaleFactors(image: any) {
	var opticalBands = image.multiply(0.0000275).add(-0.2).copyProperties(image, ["system:time_start"]);
	return opticalBands
}

export function clipToAOI(AOI: any, image: any) {
	return image.clip(AOI);
}

export function resample10m(image: any) {
	return image.resample('bicubic').reproject({
		crs: 'EPSG:32644',
		scale: 10 // Resampling to 10m
	});
}

export function calculateClassAreas(classifiedImage: any, region: any, scale: number) {
	// Initialize an empty dictionary to store class areas
	var classAreaDict = ee.Dictionary();

	// List of classes
	var classes = [2, 3, 4, 5];
	var classNames = ['treeCover', 'soil', 'building', 'waterBody'];

	// Loop through each class
	classes.forEach(function(classValue, index) {
		// Create a mask for the specific class
		var classMask = classifiedImage.eq(classValue);

		// Calculate the area in square meters
		var area = classMask.multiply(ee.Image.pixelArea())
			.reduceRegion({
				reducer: ee.Reducer.sum(),
				geometry: region,
				scale: scale,
				maxPixels: 1e9
			});

		// Convert the area to hectares and add it to the dictionary
		var areaHa = ee.Number(area.get('class')).divide(10000);
		classAreaDict = classAreaDict.set(classNames[index], areaHa);
	});

	return classAreaDict;
}
export function calculateAreaChange(initialArea: any, finalArea: any) {
	// Get the keys (class names) from the dictionaries
	var keys = initialArea.keys();

	// Map over the keys to compute the difference for each class
	var changeDict = keys.map(function(key: any) {
		// Calculate the change for each class
		var change = ee.Number(finalArea.get(key)).subtract(initialArea.get(key));
		return ee.List([key, change]);
	});

	// Convert the list of key-value pairs back to a dictionary
	return ee.Dictionary(changeDict.flatten());
}
