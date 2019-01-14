import xmlioNode from '../src/index'

const xml = `<xml>
	<locations>
		<location xml:id="14">Aurora</location>
		<location xml:id="15">
			<name>Buenos "Bono" Aires</name>
			<size on="14">12.000.000</size>
		</location>
	</locations>
</xml>`

describe('xmlio - replace', () => {
	test('When a target is not found, a warning is thrown', async () => {
		const replace = (el: HTMLElement) => `#should-not-get-called`
		const output = await xmlioNode(xml, 
			[{ type: 'replace', targetSelector: '#does-not-exist', sourceSelectorFunc: replace }],
			[{ type: 'xml' }]
		)
		expect(output).toBe(xml)
	})

	test('When a source is not found, a warning is thrown', async () => {
		const replace = (el: HTMLElement) => `#does-not-exist`
		const output = await xmlioNode(xml, 
			[{ type: 'replace', targetSelector: 'size', sourceSelectorFunc: replace }],
			[{ type: 'xml' }]
		)
		expect(output).toBe(xml)
	})

	test('Replace a single target with a single source. Keep the source', async () => {
		const replace = (el: HTMLElement) => `size[on="${el.getAttribute('xml:id')}"]`
		const output = await xmlioNode(xml, 
			[{ type: 'replace', targetSelector: 'location[xml:id="14"]', sourceSelectorFunc: replace, removeSource: false }],
			[{ type: 'xml' }]
		)

		expect(output).toBe(
`<xml>
	<locations>
		<size on="14">12.000.000</size>
		<location xml:id="15">
			<name>Buenos "Bono" Aires</name>
			<size on="14">12.000.000</size>
		</location>
	</locations>
</xml>`)
	})

	test('Replace a single target with a single source. Remove the source', async () => {
		const replace = (el: HTMLElement) => `size[on="${el.getAttribute('xml:id')}"]`
		const output = await xmlioNode(xml, 
			[{ type: 'replace', targetSelector: 'location[xml:id="14"]', sourceSelectorFunc: replace }],
			[{ type: 'xml' }]
		)

		expect(output).toBe(
`<xml>
	<locations>
		<size on="14">12.000.000</size>
		<location xml:id="15">
			<name>Buenos "Bono" Aires</name>
			
		</location>
	</locations>
</xml>`)
	})

	test('Replace multiple targets with a single source. Keep the source abcd', async () => {
		const replace = (el: HTMLElement) => `size`
		const output = await xmlioNode(xml, 
			[{ type: 'replace', targetSelector: 'location', sourceSelectorFunc: replace, removeSource: false }],
			[{ type: 'xml' }]
		)

		expect(output).toBe(
`<xml>
	<locations>
		<size on="14">12.000.000</size>
		<size on="14">12.000.000</size>
	</locations>
</xml>`)
	})

	test('Replace multiple targets with a single source. The source is removed and thus the second target is not replaced', async () => {
		const replace = (el: HTMLElement) => `size`
		const output = await xmlioNode(xml, 
			[{ type: 'replace', targetSelector: 'location', sourceSelectorFunc: replace }],
			[{ type: 'xml' }]
		)

		expect(output).toBe(
`<xml>
	<locations>
		<size on="14">12.000.000</size>
		<location xml:id="15">
			<name>Buenos "Bono" Aires</name>
			
		</location>
	</locations>
</xml>`)
	})

	test('Replace a single target with multiple sources', async () => {
		const replace = (el: HTMLElement) => `location`
		const output = await xmlioNode(xml, 
			[{ type: 'replace', targetSelector: 'locations', sourceSelectorFunc: replace }],
			[{ type: 'xml' }]
		)

		expect(output).toBe(
`<xml>
	<location xml:id="14">Aurora</location><location xml:id="15">
			<name>Buenos "Bono" Aires</name>
			<size on="14">12.000.000</size>
		</location>
</xml>`)
	})

	test('Replace a target with new node', async () => {
		const replace = (el: HTMLElement) => document.createElement('c')
		const output = await xmlioNode('<a><b>hi</b></a>', 
			[{ type: 'replace', targetSelector: 'b', sourceSelectorFunc: replace }],
			[{ type: 'xml' }]
		)

		expect(output).toBe('<a><c></c></a>')
	})

	test('Replace a target with a text node', async () => {
		const replace = (el: HTMLElement) => document.createTextNode('c')
		const output = await xmlioNode('<a><b>hi</b></a>', 
			[{ type: 'replace', targetSelector: 'b', sourceSelectorFunc: replace }],
			[{ type: 'xml' }]
		)

		expect(output).toBe('<a>c</a>')
	})
})