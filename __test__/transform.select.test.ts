import xmlioNode from '../src/index'

const xml = `<xml>
	<locs>
		<loc>
			<name>Den Haag</name>
			<name>'s Gravenhage</name>
		</loc>
		<loc>
			<name>Buenos Aires</name>
			<name>Bono</name>
		</loc>
	</locs>
</xml>`

describe('xmlio - select', () => {
	test('Select with selector which does not find any elements', async () => {
		const output = await xmlioNode(xml,
			[{ type: 'select', selector: '#does-not-exist' }],
			[{ type: 'xml' }]
		)
		expect(output).toBeNull()
	})

	test('Select with :not() selector', async () => {
		const output = await xmlioNode('<a><b id="1"/><b id="2"/></a>',
			[{ type: 'select', selector: 'b:not([id="2"])' }],
			[{ type: 'data' }]
		)
		expect((output as DataNode).attributes.id).toBe('1')
	})

	test('Select an element with a namespace in the name', async () => {
		const output = await xmlioNode('<wrapper><ns:tag /></wrapper>',
			[{ type: 'select', selector: 'ns:tag'}],
			[{ type: 'xml' }],
			{ namespaces: ['ns'] }
		)
		expect(output).toBe('<ns:tag/>')
	})

	test('Select an element with a namespace in an attribute. Namespace on the root', async () => {
		const output = await xmlioNode('<wrapper><div some:attr="some value" /></wrapper>',
			[{ type: 'select', selector: 'div[some:attr="some value"]'}],
			[{ type: 'xml' }],
			{ namespaces: ['some'] }
		)
		expect(output).toBe('<div some:attr="some value"/>')
	})

	test('Select an element with a namespace in an attribute. Namespace on the tag', async () => {
		const output = await xmlioNode('<wrapper><div some:attr="some value" xmlns:some="http://example.com" /></wrapper>',
			[{ type: 'select', selector: 'div[some:attr="some value"]' }],
			[{ type: 'xml' }]
		)
		expect(output).toBe('<div xmlns:some="http://example.com" some:attr="some value"/>')
	})

	test('Select with selector which finds only one element', async () => {
		const output = await xmlioNode(xml,
			[{ type: 'select', selector: 'locs' }],
			[{ type: 'xml' }]
		)
		expect(output).toBe(
	`<locs>
		<loc>
			<name>Den Haag</name>
			<name>'s Gravenhage</name>
		</loc>
		<loc>
			<name>Buenos Aires</name>
			<name>Bono</name>
		</loc>
	</locs>`)
	})

	test('Select with selector which finds two elements', async () => {
		const output = await xmlioNode(xml,
			[{ type: 'select', selector: 'loc' }],
			[{ type: 'xml' }]
		)
		expect(output).toEqual(
		[`<loc>
			<name>Den Haag</name>
			<name>'s Gravenhage</name>
		</loc>`,
		`<loc>
			<name>Buenos Aires</name>
			<name>Bono</name>
		</loc>`])
	})

	test('Select with selector which finds four elements', async () => {
		const output = await xmlioNode(xml,
			[{ type: 'select', selector: 'name' }],
			[{ type: 'xml' }]
		)
		expect(output).toEqual([`<name>Den Haag</name>`, `<name>'s Gravenhage</name>`, `<name>Buenos Aires</name>`, `<name>Bono</name>`])
	})

	test('Multiple selects', async () => {
		const output = await xmlioNode(xml,
			[
				{ type: 'select', selector: 'locs' },
				{ type: 'select', selector: 'loc' },
				{ type: 'select', selector: 'name' },
			],
			[{ type: 'xml' }]
		)
		expect(output).toEqual([`<name>Den Haag</name>`, `<name>'s Gravenhage</name>`, `<name>Buenos Aires</name>`, `<name>Bono</name>`])
	})
})