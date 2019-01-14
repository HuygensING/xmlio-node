import xmlioNode from '../src/index'

const xml = `<xml>
	<locs>
		<loc some:attr="5">
			<some:Naam some:attr="1">Den Haag</some:Naam>
			<some:nOam some:attr="2">'s Gravenhage</some:nOam>
		</loc>
		<loc some:attr="6">
			<some:name some:aTtribut="3">Buenos Aires</some:name>
			<some:name some:Attrib="4">Bono</some:name>
		</loc>
	</locs>
</xml>`

describe('xmlio - select with namespaces and case', () => {
	test('Select with namespaced elements and attributes', async () => {
		const output = await xmlioNode(xml,
			[{ type: 'select', selector: 'loc'}],
			[{ type: 'xml' }],
			{ namespaces: ['some'] }
		)
		expect(output).toEqual([
		`<loc some:attr="5">
			<some:Naam some:attr="1">Den Haag</some:Naam>
			<some:nOam some:attr="2">'s Gravenhage</some:nOam>
		</loc>`,
		`<loc some:attr="6">
			<some:name some:aTtribut="3">Buenos Aires</some:name>
			<some:name some:Attrib="4">Bono</some:name>
		</loc>`
		])
	})

	test('Select element with namespace and upper case in node name', async () => {
		const output = await xmlioNode(xml,
			[{ type: 'select', selector: 'some:Naam'}],
			[{ type: 'xml' }],
			{ namespaces: ['some'] }
		)
		expect(output).toBe(`<some:Naam some:attr="1">Den Haag</some:Naam>`)
	})

	test('Select element with namespace and upper case in node name. Second char', async () => {
		const output = await xmlioNode(xml,
			[{ type: 'select', selector: 'some:nOam'}],
			[{ type: 'xml' }],
			{ namespaces: ['some'] }
		)
		expect(output).toBe(`<some:nOam some:attr="2">'s Gravenhage</some:nOam>`)
	})

	test('Select element with namespace and upper case in attribute. Second char', async () => {
		const output = await xmlioNode(xml,
			[{ type: 'select', selector: '[some:aTtribut]'}],
			[{ type: 'xml' }],
			{ namespaces: ['some'] }
		)
		expect(output).toBe(`<some:name some:aTtribut="3">Buenos Aires</some:name>`)
	})

	test('Select element with namespace and upper case in attribute', async () => {
		const output = await xmlioNode(xml,
			[{ type: 'select', selector: '[some:Attrib]'}],
			[{ type: 'xml' }],
			{ namespaces: ['some'] }
		)
		expect(output).toBe(`<some:name some:Attrib="4">Bono</some:name>`)
	})
})