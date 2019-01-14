import xmlioNode from '../src/index'

const xml = `<xml>
	<locs>
		<loc>
			<name id="1">Den Haag</name>
			<name id="2">'s Gravenhage</name>
		</loc>
		<loc>
			<name id="3">Buenos Aires</name>
			<name id="4">Bono</name>
		</loc>
	</locs>
</xml>`

describe('xmlio - change', () => {
	test('Rename root element', async () => {
		const output = await xmlioNode('<div class="hi" id="ho">he</div>',
			[{ type: 'rename', selector: 'div', newName: 'section' }],
			[{ type: 'xml' }]
		)
		expect(output).toBe('<section class="hi" id="ho">he</section>')
	})

	test('Rename one element', async () => {
		const output = await xmlioNode(xml,
			[
				{ type: 'rename', selector: 'locs', newName: 'locations' },
				{ type: 'select', selector: 'locations'},
			],
			[{ type: 'data', deep: false }]
		)
		expect(output.name).toBe('locations')
	})

	test('Rename multiple elements', async () => {
		const output = await xmlioNode(xml,
			[
				{ type: 'rename', selector: 'name', newName: 'naam' },
				{ type: 'select', selector: 'naam'},
			],
			[{ type: 'data', deep: false }]
		)

		const output2 = Array.isArray(output) ? output : [output]
		expect(output2.map((el: any) => el.name)).toEqual(['naam', 'naam', 'naam', 'naam'])
	})
})
