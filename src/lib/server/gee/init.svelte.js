import ee from "@google/earthengine"
import privateKey from "$lib/../../PRIVATE_KEY.json"

ee.data.authenticateViaPrivateKey(privateKey,
	() => {
		ee.initialize(null, null,
			() => {
				var image = new ee.Image('srtm90_v4')
				image.getMap({ min: 0, max: 1000 }, (map) => {
					console.log(map)
				})
			},
			(error) => {
				console.error("Inizialation error: " + error)
			}
		)
	},
	(e) => {
		console.error("Authentication Error: " + e)
	}
)

