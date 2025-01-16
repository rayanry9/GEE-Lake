import ee from "@google/earthengine"
import privateKey from "$lib/../../PRIVATE_KEY.json"
import { setAOI } from "./inputs";


ee.data.authenticateViaPrivateKey(privateKey,
	() => {
		ee.initialize(null, null, () => {

			setAOI(ee.FeatureCollection("projects/ee-ma24btech11018/assets/Ameenpur_Lake_shapefile"))

		})
	},
	(e) => {
		console.error("Authentication Error: " + e)
	}
)
