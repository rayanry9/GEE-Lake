//@ts-ignore
import ee from "@google/earthengine"
import privateKey from "$lib/../../PRIVATE_KEY.json"

export async function initGEE(): Promise<Boolean> {
	return new Promise((resolve, reject) => {
		ee.data.authenticateViaPrivateKey(privateKey,
			() => {
				ee.initialize(null, null, () => {
					console.info("GEE Authorized")
					resolve(true)
				})
			},
			(e: any) => {
				console.error("Authentication Error: " + e)
				reject(false)
			}
		)
	})

}

