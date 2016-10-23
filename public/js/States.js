
/////////////////////////// STATE MANAGER /////////////////////////////////////

function StateManager()
{
	this.stateGroups = {};
	this.currentStateGroup = null;
};

StateManager.prototype.init = function(stateconfig)
{
	var self = this;

	// create all the states
	this.parseStateConfig(stateconfig);

	// watch any section changes clicked by the user to change state
	PubSub.subscribe('section', function(msg, data)
	{
		debug.debug('StateManager PubSub sub section', msg, data);
		self.goToGroup(data);
	});

	// listen button presses on joystick
	PubSub.subscribe('gamePadButton', function(msg, data)
	{
		debug.debug('StateManager PubSub sub gamePadButton', msg, data);
		self.goToGroup(data.name);
	});

	// listen for server events
	PubSub.subscribe('stateSet', function(msg, data)
	{
		debug.debug('StateManager PubSub sub stateSet', msg, data);
		// set the new state
		self.stateGroups[data.group].setState(data.state);
	});
	PubSub.subscribe('stateInterrupt', function(msg, data)
	{
		debug.debug('StateManager PubSub sub stateInterrupt', msg, data);
		self.goToGroup(data.group);
	});
};

/**
 * @description
 * Parse state config.  Create and add group and state objects.
 * @param {string} stateconfig The state config object
 * @example State config:
 * 	{
 *	groups: [
 *		{
 *			name: 'groupname',
 *			states: [
 *				{
 *					name: 'stateonename', // required
 *					mode: 'section',	// optional, default
 *					next: 'statetwoname'	// optional
 *				},
 *				{
 *					name: 'statetwoname',
 *					mode: 'modal',
 *					game: 'gameOneName'	// optional
 *				}
 *			]
 *		}
 *	]
 *	}
 */
StateManager.prototype.parseStateConfig = function(stateconfig)
{
	if (stateconfig.groups)
	{
		for (var g = 0, glen = stateconfig.groups.length; g < glen; g++)
		{
			var group = stateconfig.groups[g];
			debug.debug('Adding state group:', group.name);

			var sg = new StateGroup();
			sg.init(group.name);
			this.stateGroups[group.name] = sg;

			if (group.states)
			{
				for (var s = 0, slen = group.states.length; s < slen; s++)
				{
					var name = group.states[s].name;
					debug.debug('Adding state :', name);
					var mode = group.states[s].mode ? group.states[s].mode : 'section';
					var next = group.states[s].next ? group.states[s].next : null;
					var game = group.states[s].game ? group.states[s].game : null;
					sg.addState(name, mode, next, game);
				}
			}
		}
	}
};

/**
 * @description
 * Go to a group of states
 * @param {string} name The name of the state group
 */
StateManager.prototype.goToGroup = function(name)
{
	this.currentStateGroup = this.stateGroups[name];
	this.stateGroups[name].goToCurrentState();
};

///////////////////////////// STATEGROUP  /////////////////////////////////////

function StateGroup()
{
	this.name = null;
	this.states = {};
	this.defaultState = null;
	this.currentState = null;
};

StateGroup.prototype.init = function(name)
{
	this.name = name;
};

StateGroup.prototype.addState = function(name, mode, next, gameName)
{
	this.states[name] = new State(this.name, name, mode, next, gameName);

	// set the default state to the first one added
	// user can set manually if desired
	if (!this.defaultState)
	{
		this.setDefaultState(name);
	}

	return this.states[name];
};

StateGroup.prototype.setDefaultState = function(name)
{
	this.defaultState = this.states[name];
};

StateGroup.prototype.goToDefaultState = function()
{
	this.currentState = this.defaultState;
	this.run();
};
StateGroup.prototype.goToCurrentState = function()
{
	if (!this.currentState)
	{
		this.goToDefaultState();
	}
	else
	{
		this.run();
	}
};

/**
 * @description
 * Go to a specific state
 */
StateGroup.prototype.goToState = function(name)
{
	this.currentState = this.states[name];
	this.run();
};

/**
 * @description
 * Set a specific state without going to it
 */
StateGroup.prototype.setState = function(name)
{
	this.currentState = this.states[name];
};

StateGroup.prototype.jumpToNextState = function()
{
	this.currentState = this.states[this.currentState.next];
	this.run();
};

StateGroup.prototype.run = function()
{
	PubSub.publish('stateGroup', this.name);
	debug.debug('StateGroup currentState:', {group: this.currentState});
	this.currentState.run();
};

/////////////////////////////// STATE  ////////////////////////////////////////

function State(group, name, mode, next, gameName)
{
	this.group = null;
	this.name = null;
	this.mode = null;
	this.next = null;
	this.gameObj = null;

	this.init(group, name, mode, next, gameName);
};

State.prototype.init = function(group, name, mode, next, gameName)
{
	this.group = group;
	this.name = name;
	this.mode = mode;
	this.next = next;
	if (gameName)
		this.gameObj = new window[gameName]();
};

State.prototype.run = function()
{
	debug.debug("State run: ", this.name);
	PubSub.publish('state', {state: this.name, group: this.group, mode: this.mode, gameObj: this.gameObj});
};
