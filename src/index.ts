/// <reference types="xmlio" />

import puppeteer from 'puppeteer'

function logWarning(warning: string) {
	console.log(`[WARNING] ${warning}`)
}

export default async function XMLioNode(
	xml: string,
	transformers: XMLioTransformer[] | Function = [],
	exporters: Exporter[] = [],
	options: DomParserOptions = {}
) {
	const browser = await puppeteer.launch({
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox'
		]
	})

	const page = await browser.newPage()
	page.on('console', (msg: any) => {
		msg = msg.text()
		if (msg.slice(0, 7) === 'WARNING') logWarning(msg.slice(7))
		else console.log('From page: ', msg)
	})
	await page.addScriptTag({
		path: './node_modules/xmlio/dist/bundle.js'
	})


	let transformerString = ''
	if (Array.isArray(transformers)) {
		transformerString = JSON.stringify(transformers.map(transformer => {
			if (transformer.type === 'replace' && typeof transformer.sourceSelectorFunc !== 'string') {
				// @ts-ignore
				transformer.sourceSelectorFunc = transformer.sourceSelectorFunc.toString()
			}
			if (transformer.type === 'change' && typeof transformer.changeFunc !== 'string') {
				// @ts-ignore
				transformer.changeFunc = transformer.changeFunc.toString()
			}
			return transformer
		}))
	} else {
		transformerString = transformers.toString()
	}

	const output: any = await page.evaluate(
		function(xml: string, transformers: string, exporters: string, options: string, transformerArray: boolean) {
			function unwrapStringFunction(func: string) {
				const outerFunc = new Function(`return ${func}`)
				return outerFunc() // Return the inner function, because that is what the user passed
			}

			// @ts-ignore
			const xmlio = new XMLio(xml, JSON.parse(options))

			if (transformerArray) {
				JSON.parse(transformers).forEach((t: XMLioTransformer) => {
					if (t.type === 'replace') {
						// @ts-ignore
						t.sourceSelectorFunc = unwrapStringFunction(t.sourceSelectorFunc)
					} 
					if (t.type === 'change') {
						// @ts-ignore
						t.changeFunc = unwrapStringFunction(t.changeFunc)
					}
					return xmlio.addTransform(t)
				})
			} else {
				unwrapStringFunction(transformers)(xmlio)
			}

			return xmlio.export(JSON.parse(exporters))
		},
		xml,
		transformerString,
		JSON.stringify(exporters),
		JSON.stringify(options),
		Array.isArray(transformers)
	)

	browser.close()

	return output
}
