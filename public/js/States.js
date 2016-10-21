
/////////////////////////// STATE MANAGER /////////////////////////////////////

function StateManager()
{
	this.stateGroups = {};
	this.currentStateGroup = null;
};

StateManager.prototype.init = function()
{
	var self = this;

	// create all the states

	// life support
	var sgLifeSupport = new StateGroup();
	sgLifeSupport.init('lifesupport');
	this.stateGroups['lifesupport'] = sgLifeSupport;
	sgLifeSupport.addState('active', 'failure');
	sgLifeSupport.addState('failure', 'success', 'GameLifesupport');
	sgLifeSupport.addState('success');

	// communications
	var sgCommunications = new StateGroup();
	sgCommunications.init('communications');
	this.stateGroups['communications'] = sgCommunications;
	sgCommunications.addState('unreachable', 'linking');
	sgCommunications.addState('linking', 'transmission');
	sgCommunications.addState('transmission');

	// shields
	var sgShields = new StateGroup();
	sgShields.init('shields');
	this.stateGroups['shields'] = sgShields;
	sgShields.addState('enabled', 'manual');
	sgShields.addState('manual', 'override');
	sgShields.addState('override');

	// iPad shields
	var ipShields = new StateGroup();
	ipShields.init('ipadShields');
	this.stateGroups['ipadShields'] = ipShields;
	ipShields.addState('enabled', 'manual');
	ipShields.addState('manual', 'override');
	ipShields.addState('override');

	// schematics
	var sgSchematics = new StateGroup();
	sgSchematics.init('schematics');
	this.stateGroups['schematics'] = sgSchematics;
	sgSchematics.addState('rendering', 'success');
	sgSchematics.addState('success', null, 'GameSchematics');

	// ai
	var sgAi = new StateGroup();
	sgAi.init('ai');
	this.stateGroups['ai'] = sgAi;
	sgAi.addState('welcome', 'success');
	sgAi.addState('success');

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
	PubSub.subscribe('event', function(msg, data)
	{
		debug.debug('StateManager PubSub sub event', msg, data);
		// set the new state
		self.stateGroups[data.group].setState(data.state);
		// if it is an interrupt state, go to that section
		if (data.interrupt);
		{
			self.goToGroup(data.group);
		}
	});
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

StateGroup.prototype.addState = function(name, next, gameName)
{
	this.states[name] = new State(this.name, name, next, gameName);

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

function State(group, name, next, gameName)
{
	this.group = null;
	this.name = null;
	this.next = null;
	this.gameObj = null;

	this.init(group, name, next, gameName);
};

State.prototype.init = function(group, name, next, gameName)
{
	this.group = group;
	this.name = name;
	this.next = next;
	if (gameName)
		this.gameObj = new window[gameName]();
};

State.prototype.run = function()
{
	debug.debug("State run: ", this.name);
	PubSub.publish('state', {state: this.name, group: this.group, gameObj: this.gameObj});
};
