//@ts-ignore
import ee from "@google/earthengine"
import privateKey from "$lib/../../PRIVATE_KEY.json"
import { Console } from "../consoleColors"

export async function initGEE(): Promise<Boolean> {
	return new Promise((resolve, reject) => {
		ee.data.authenticateViaPrivateKey(privateKey,
			() => {
				ee.initialize(null, null, () => {
					Console.success("Google Earth Engine Authenticated")
					resolve(true)
				})
			},
			(e: any) => {
				Console.error("Could not authenticate Google Earth Engine. Did you add PRIVATE_KEY.json in rootDir by making a service account?\n\n" + e + "\n")
				reject(false)
			}
		)
	})

}

