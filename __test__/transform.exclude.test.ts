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

describe('xmlio - exlude', () => {
	test('Exclude selector does not match any elements', async () => {
		const output = await xmlioNode(xml, [{ type: 'exclude', selector: '#does-not-exist' }], [{ type: 'xml' }])
		expect(output).toBe(xml)
	})

	test('Exclude selector matches element <name>', async () => {
		const output = await xmlioNode(xml, [{ type: 'exclude', selector: 'name' }], [{ type: 'xml' }])
		expect(output).toBe(
`<xml>
	<locs>
		<loc>
			
			
		</loc>
		<loc>
			
			
		</loc>
	</locs>
</xml>`
)
	})

	test('Exclude selector matches element <loc>', async () => {
		const output = await xmlioNode(xml, [{ type: 'exclude', selector: 'loc' }], [{ type: 'xml' }])
		expect(output).toBe(
`<xml>
	<locs>
		
		
	</locs>
</xml>`
)
	})
	
	test('Exclude selector matches element <locs>', async () => {
		const output = await xmlioNode(xml, [{ type: 'exclude', selector: 'locs' }], [{ type: 'xml' }])
		expect(output).toBe(
`<xml>
	
</xml>`
)
	})

	test('Excluding the root node yields an empty string', async () => {
		const output = await xmlioNode(xml, [{ type: 'exclude', selector: 'xml'}], [{ type: 'xml' }])
		expect(output).toBe('')
	})

	test('Exclude with multiple selectors', async () => {
		const output = await xmlioNode(
			'<numbers><one /><two /><three /><four /></numbers>',
			[{ type: 'exclude', selector: ['two', 'four'] }],
			[{ type: 'xml' }]
		)
		expect(output).toBe('<numbers><one/><three/></numbers>')
	})
})