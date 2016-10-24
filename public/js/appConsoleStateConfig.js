// do not duplicate state names, even across groups
var stateConfig = {
	groups: [
		{
			name: 'lifesupport',
			states: [
				{
					name: 'active',
					mode: 'section',
					next: 'failure'
				},
				{
					name: 'failure',
					mode: 'section',
					next: 'bypass',
					task: 'TaskLifesupport'
				},
				{
					name: 'bypass',
					mode: 'section',
				}
			]
		},
		{
			name: 'communications',
			states: [
				{
					name: 'unreachable',
					mode: 'section',
					next: 'linking'
				},
				{
					name: 'linking',
					mode: 'section',
					next: 'transmission'
				},
				{
					name: 'transmission',
					mode: 'section',
				}
			]
		},
		{
			name: 'shields',
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
					mode: 'section',
				}
			]
		},
		{
			name: 'schematics',
			states: [
				{
					name: 'rendering',
					mode: 'section',
					next: 'success',
					task: 'TaskSchematicsRendering'
				},
				{
					name: 'success',
					mode: 'section',
					task: 'TaskSchematics'
				}
			]
		},
		{
			name: 'aigood',
			states: [
				{
					name: 'diagnostic',
					mode: 'modal',
					next: 'donttakeme',
					task: 'TaskAigoodDiagnostic'
				},
				{
					name: 'donttakeme',
					mode: 'modal',
					next: 'incinerator'
				},
				{
					name: 'incinerator',
					mode: 'modal'
				}
			]
		},
		{
			name: 'aibad',
			states: [
				{
					name: 'puzzle',
					mode: 'modal',
					next: 'shieldresult'
				},
				{
					name: 'shieldresult',
					mode: 'modal',
					next: 'boxopen'
				},
				{
					name: 'boxopen',
					mode: 'modal'
				}
			]
		},
		{
			name: 'selfdestruct',
			states: [
				{
					name: 'countdown',
					mode: 'modal'
				}
			]
		}
	]
};