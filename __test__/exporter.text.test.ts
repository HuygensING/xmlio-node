import xmlioNode from '../src/index'

const xml = `<xml>
	<locs>
		<loc>
			<name id="1">Den Haag</name>
			<name id="2">'s-Gravenhage</name>
		</loc>
		<loc>
			<name id="3">Buenos Aires</name>
			<name id="4">Bono</name>
		</loc>
	</locs>
</xml>`

describe('xmlio - exporter - text', () => {
	test('Default export to text', async () => {
		const output = await xmlioNode(xml, [], [{ type: 'text' }])
		// const output = await xmlio.export({ type: 'text' })
		expect(output).toBe("Den Haag 's-Gravenhage Buenos Aires Bono")
	})

	test('Export to text with join', async () => {
		const output = await xmlioNode(xml, [], [{ type: 'text', join: '||' }])
		expect(output).toBe("Den Haag||'s-Gravenhage||Buenos Aires||Bono")
	})

	test('Export to text with newline join', async () => {
		const output = await xmlioNode(xml, [], [{ type: 'text', join: '\n' }])
		expect(output).toBe(
`Den Haag
's-Gravenhage
Buenos Aires
Bono`
		)
	})
})