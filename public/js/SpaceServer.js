
//////////////////////////// SPACESERVER //////////////////////////////////////

function SpaceServer()
{
	this.socket = false;
	this.username = 'main';
};

SpaceServer.prototype.init = function()
{
	var self = this;

	debug.debug('SpaceServer init');

	this.socket = io.connect(config.get('server'));

	debug.debug('SpaceServer init register user');

	this.send('user', 'register', {username: this.username});

	this.socket.on('new message', function (data) {
		this.receiveCommand(data);
	});
};

/**
 * @param {string} command The name of the command, supported: timer, state
 */
SpaceServer.prototype.send = function(event, command, data)
{
	var message = this.formatMessage(command, data);

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
	switch (data.event)
	{
		case 'timer':
			PubSub.publish(data.event, data.command);
			break;
		case 'state':
			switch (data.command)
			{
				case 'set':
					PubSub.publish('stateSet', data.data);
					break;
				case 'interrupt':
					PubSub.publish('stateInterrupt', data.data);
					break;
			}
			break;
	}
	PubSub.publish(data.event)
};