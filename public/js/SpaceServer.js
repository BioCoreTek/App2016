
//////////////////////////// SPACESERVER //////////////////////////////////////

function SpaceServer()
{
	this.socket = false;
	this.username = null;
};

SpaceServer.prototype.init = function(username)
{
	var self = this;

	debug.debug('SpaceServer init');

	this.username = username;

	this.socket = io.connect(config.get('server'));

//	debug.debug('SpaceServer init register user');

//	this.socket.emit('user register', {username: this.username});

	this.socket.on('new message', function (data) {
		self.receiveCommand(data);
	});

	this.socket.on('status', function (data) {
		self.receiveCommandStatus(data);
	});

	PubSub.subscribe('server', function(msg, data)
	{
		debug.debug('SpaceServer PubSub sub server', msg, data);
		self.send(data.event, data.command, data.data);
	});
};

/**
 * @param {string} command The name of the command, supported: timer, state
 */
SpaceServer.prototype.send = function(event, command, data)
{
	var message = this.formatMessage(event, command, data);

	debug.debug('emit new message:', message);

	this.socket.emit('new message', message);
};

SpaceServer.prototype.formatMessage = function(event, command, data)
{
	message = {};
	message.event = event;
	if (command)
		message.command = command;
	if (data)
		message.data = data;
	return message;
};

SpaceServer.prototype.receiveCommand = function(data)
{
	debug.debug('receiveCommand', data);
	var msg = data.message;
	switch (msg.event)
	{
		case 'status':
			debug.debug('receiveCommand status', msg);
			PubSub.publish('status', {
				status: msg.status,
				mode: msg.devmode
			});
			break;
		case 'timer':
			debug.debug('receiveCommand timer', msg);
			PubSub.publish(msg.event, msg.command);
			break;
		case 'state':
			debug.debug('receiveCommand state', msg);
			switch (msg.command)
			{
				case 'set':
					PubSub.publish('stateSet', msg.data);
					break;
				case 'interrupt':
					PubSub.publish('stateInterrupt', msg.data);
					break;
			}
			break;
		case 'task':
			debug.debug('receiveCommand task', msg);
			switch (msg.command)
			{
				case 'check':
				case 'result':
					debug.debug('receiveCommand task', msg);
					PubSub.publish(msg.event, {
						command: msg.command,
						taskname: msg.data.taskname,
						result: msg.data.result
					});
					break;
			}
			break;
	}
};
SpaceServer.prototype.receiveCommandStatus = function(data)
{
	debug.log('receiveCommandStatus', data);

	PubSub.publish('status', {
		status: data.status,
		mode: data.devmode,
		team: data.team
	});
};