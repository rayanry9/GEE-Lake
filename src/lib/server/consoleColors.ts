import colors from "colors/safe"
export namespace Console {
	export const error = (str: string) => console.error(colors.bgRed(colors.white(" " + new Date().toLocaleString() + " ")) + " " + str)
	export const success = (str: string) => console.info(colors.bgGreen(colors.white(" " + new Date().toLocaleString() + " ")) + " " + str)
	export const info = (str: string) => console.info(colors.bgCyan(colors.white(" " + new Date().toLocaleString() + " ")) + " " + str)
	export const task = (str: string) => console.info(colors.bgBlue(colors.white(" " + new Date().toLocaleString() + " ")) + " " + str)
	export const requestInfo = (type: string, ip: string, url: string, str: string) => console.info(colors.bgWhite(colors.black(" " + new Date().toLocaleString() + " ")) + " " + colors.bgCyan(colors.white(" " + type + " ")) + " " + colors.blue(ip) + " " + str + " " + colors.cyan(url))
	export const requestSuccess = (type: string, ip: string, url: string, str: string) => console.info(colors.bgWhite(colors.black(" " + new Date().toLocaleString() + " ")) + " " + colors.bgGreen(colors.white(" " + type + " ")) + " " + colors.blue(ip) + " " + str + " " + colors.cyan(url))
	export const requestError = (type: string, ip: string, url: string, str: string) => console.info(colors.bgWhite(colors.black(" " + new Date().toLocaleString() + " ")) + " " + colors.bgRed(colors.white(" " + type + " ")) + " " + colors.blue(ip) + " " + str + " " + colors.cyan(url))
}
