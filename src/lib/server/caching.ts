import NodeCache from "node-cache";
import { Console } from "./consoleColors";

const hoursForTTL = 6
const cache = new NodeCache({ stdTTL: hoursForTTL * 60 * 60, checkperiod: 30 * 60 })

export function getFromCache(jsonStr: string): string {
	Console.success("Retrieved From Cache")
	return cache.get(jsonStr) as string
}
export function hasInCache(jsonStr: string): boolean {
	if (cache.has(jsonStr)) {
		Console.success("Exists In Cache")
		return true
	} else {
		Console.error("Does Not Exists In Cache")
		return false
	}
}
export function setInCache(keyJsonStr: string, dataJsonStr: string): boolean {

	if (cache.set(keyJsonStr, dataJsonStr)) {
		Console.success("Set Value In Cache")
		return true
	} else {
		Console.error("Could Not Set Value In Cache")
		return false
	}
}


