
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

	debug.debug('SpaceServer init register user');

	this.socket.emit('user register', {username: this.username});

	this.socket.on('new message', function (data) {
		self.receiveCommand(data);
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
				case 'result':
					debug.debug('receiveCommand task result', msg);
					PubSub.publish(msg.event, msg.data);
					break;
			}
			break;
	}
};