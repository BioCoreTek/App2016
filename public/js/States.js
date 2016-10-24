
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

	// listen for app events about states
	PubSub.subscribe('stateNext', function(msg, data)
	{
		debug.debug('StateManager PubSub sub stateNext', msg, data);
		// set the next state, if current state, go to it
		if (self.currentStateGroup.name == data.group)
		{
			debug.debug('StateManager PubSub sub stateNext goToNextState');
			self.stateGroups[data.group].goToNextState();
		}
		else
		{
			debug.debug('StateManager PubSub sub stateNext setNextState');
			self.stateGroups[data.group].setNextState();
		}
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
 *					task: 'taskOneName'	// optional
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
					var task = group.states[s].task ? group.states[s].task : null;
					sg.addState(name, mode, next, task);
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

StateGroup.prototype.addState = function(name, mode, next, task)
{
	this.states[name] = new State(this.name, name, mode, next, task);

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
	this.runState();
};
StateGroup.prototype.goToCurrentState = function()
{
	if (!this.currentState)
	{
		this.goToDefaultState();
	}
	else
	{
		this.runState();
	}
};

/**
 * @description
 * Set a specific state without going to it
 */
StateGroup.prototype.setState = function(name)
{
	debug.debug('StateGroup setState', name);
	// exit the current state first
	this.exitState();
	this.currentState = this.states[name];
};
/**
 * @description
 * Set a the next state without going to it
 */
StateGroup.prototype.setNextState = function()
{
	debug.debug('StateGroup setNextState');
	this.setState(this.currentState.next);
};

/**
 * @description
 * Go to a specific state and run it
 */
StateGroup.prototype.goToState = function(name)
{
	debug.debug('StateGroup goToState');
	this.setState(name);
	this.runState();
};

/**
 * @description
 * Go to a the next state and run it
 */
StateGroup.prototype.goToNextState = function()
{
	debug.debug('StateGroup goToNextState');
	this.setNextState();
	this.runState();
};

StateGroup.prototype.runState = function()
{
	PubSub.publish('stateGroup', this.name);
	debug.debug('StateGroup currentState:', {group: this.currentState});
	this.currentState.run();
};

StateGroup.prototype.exitState = function()
{
	debug.debug('StateGroup exitState:', {group: this.currentState});
	if (this.currentState)
		this.currentState.exit();
};

/////////////////////////////// STATE  ////////////////////////////////////////

function State(group, name, mode, next, task)
{
	this.group = null;
	this.name = null;
	this.mode = null;
	this.next = null;
	this.task = null;
	this.taskObj = null;

	this.init(group, name, mode, next, task);
};

State.prototype.init = function(group, name, mode, next, task)
{
	this.group = group;
	this.name = name;
	this.mode = mode;
	this.next = next;
	if (task)
	{
		debug.debug('State init setting task:', task);
		this.task = task;
		this.taskObj = new window[task]();
	}
};

State.prototype.run = function()
{
	debug.debug("State run: ", this.name);
	PubSub.publish('state', {
		state: this.name,
		group: this.group,
		mode: this.mode,
		taskObj: this.taskObj
	});
};

State.prototype.exit = function()
{
	debug.debug("State exit: ", this.name);
	if (this.taskObj && this.taskObj.exit)
	{
		this.taskObj.exit();
	}
};