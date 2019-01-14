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
	test('Add an attribute to an element', async () => {
		const output = await xmlioNode(xml, [
				{ type: 'change', selector: 'locs', changeFunc: (function(el: HTMLElement) { el.setAttribute('test', 'true'); return el; }) },
				{ type: 'select', selector: 'locs' }
			], [
				{ type: 'data', deep: false }
			])
		expect(output.attributes.test).toBe('true')
	})

	test('Change the value of multiple element attributes', async () => {
		const output = await xmlioNode(xml, [
				{ type: 'change', selector: 'name', changeFunc: function(el: HTMLElement) { el.setAttribute('id', `1${el.id}`); return el; } },
				{ type: 'select', selector: 'name' }
			], [
				{ type: 'data', deep: false }
			])

		const output2 = Array.isArray(output) ? output : [output]
		expect(output2.map((el: any) => el.attributes.id)).toEqual(['11', '12', '13', '14'])
	})

	test('Add a child to an element', async () => {
		function changeFunc(el: HTMLElement) {
			const name = document.createElement('name')
			name.id = '5'
			name.innerHTML = 'Bueno'
			el.appendChild(name)
			return el
		}

		const output = await xmlioNode(xml, [
				{ type: 'change', selector: 'loc:nth-child(2)', changeFunc },
				{ type: 'select', selector: 'loc:nth-child(2)' }
			], [
				{ type: 'data' }
			])
		expect(output.children.length).toEqual(3)
	})
})
