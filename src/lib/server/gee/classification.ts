export function classification(image: any) {
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
