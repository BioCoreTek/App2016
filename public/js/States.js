
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
	sgLifeSupport.addState('active', 'failure', function() {

	});
	sgLifeSupport.addState('failure', 'success', function() {
		var c = $('.content canvas')[0];
		debug.debug(c);
		var ctx = c.getContext('2d');
		OxygenMain(ctx, gamePad.gamepad);

	});
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

	// schematics
	var sgSchematics = new StateGroup();
	sgSchematics.init('schematics');
	this.stateGroups['schematics'] = sgSchematics;
	sgSchematics.addState('rendering', ['success']);
	sgSchematics.addState('success');


	// watch any section changes clicked by the user to change state
	PubSub.subscribe('section', function(msg, data)
	{
		debug.debug('PubSub sub section', msg, data);
		self.goToGroup(data);
	});

	// listen button presses on joystick
	PubSub.subscribe('gamePadButton', function(msg, data)
	{
		debug.debug('PubSub sub gamePadButton', msg, data);
		self.goToGroup(data.name);
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

StateGroup.prototype.addState = function(name, next)
{
	this.states[name] = new State(this.name, name, next);

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

function State(group, name, next, runFn)
{
	this.name = null;
	this.group = null;
	this.next = null;
	this.runFn = null;

	this.init(group, name, next, runFn);
};

State.prototype.init = function(group, name, next, runFn)
{
	this.group = group;
	this.name = name;
	this.next = next;
};

State.prototype.run = function()
{
	debug.debug("State run: ", this.name);
	PubSub.publish('state', {state: this.name, group: this.group});
	if (this.runFn)
	{
		this.runFn();
	}
};
