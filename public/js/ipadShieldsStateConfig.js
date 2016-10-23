// do not duplicate state names, even across groups
var stateConfig = {
	groups: [
		{
			name: 'ipadshields',
			states: [
				{
					name: 'enabled',
					mode: 'section',
					next: 'manual'
				},
				{
					name: 'manual',
					mode: 'section',
					next: 'override'
				},
				{
					name: 'override',
					mode: 'section'
				}
			]
		}
	]
};