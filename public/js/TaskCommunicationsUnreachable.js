
function TaskCommunicationsUnreachable()
{
	this.taskName = 'TaskCommunicationsUnreachable';
	// static
	this.context;
	this.dotsTotal = 4;
	this.buttonIndex = config.get('triggerButtonIndex');

	this.dots = [];
	this.lastState = 1;

	this.iconMap = [
		'\uf069',
		'\uf06c',
		'\uf111',
		'\uf0c2',
		'\uf0a3',
		'\uf0e0',
		'\uf004',
		'\uf067',
		'\uf0c8',
		'\uf023',
		'\uf0fe',
		'\uf076',
		'\uf005',
		'\uf00d',
		'\uf1bb',
		'\uf072',
		'\uf146',
		'\uf009',
		'\uf075',
		'\uf0c9',
		'\uf292',
		'\uf04b',
		'\uf0e7',
		'\uf1d8',
		'\uf14a'
	];

	this.iconNameMap = [
		'fa-asterisk',
		'fa-leaf',
		'fa-circle',
		'fa-cloud',
		'fa-certificate',
		'fa-envelope',
		'fa-heart',
		'fa-plus',
		'fa-square',
		'fa-lock',
		'fa-plus-square',
		'fa-magnet',
		'fa-star',
		'fa-times',
		'fa-tree',
		'fa-plane',
		'fa-minus-square',
		'fa-th-large',
		'fa-comment',
		'fa-bars',
		'fa-hashtag',
		'fa-play',
		'fa-bolt',
		'fa-paper-plane',
		'fa-check-square'
	];

	// none, checking, error, success
	this.resultStatus = 'none';

	this.pubSubs = [];

	this.timeLengthGlobalTaskResult = config.get('eventTimes')['GlobalTaskResult'];
};

TaskCommunicationsUnreachable.prototype.init = function()
{
	var self = this;

	debug.debug('TaskCommunicationsUnreachable init');

	this.startTask();

	var c = $('.content canvas')[0];
	this.context = c.getContext('2d');

	this.restartTask();

	this.pubSubs.push(
		PubSub.subscribe('gamePadLoop', function(msg, data)
		{
			self.runFrame(data);
		})
	);

	this.pubSubs.push(
		PubSub.subscribe('task', function(msg, data)
		{
			debug.debug('TaskCommunicationsUnreachable PubSub sub task', msg, data);
			if (data && data.taskname == self.taskName)
				self.processResults(data.result);
		})
	);
};

// to be called when game exists
TaskCommunicationsUnreachable.prototype.exit = function()
{
	// remove pubsubs
	for (var i = 0, len = this.pubSubs.length; i < len; i++)
	{
		PubSub.unsubscribe(this.pubSubs[i]);
	}
};

TaskCommunicationsUnreachable.prototype.startTask = function()
{
	debug.log('TaskCommunicationsUnreachable startTask');

	// start task
	PubSub.publish('server', {
		event: 'task',
		command: 'start',
		data: {
			taskname: this.taskName
		}
	});
};

TaskCommunicationsUnreachable.prototype.stopTask = function()
{
	debug.log('TaskCommunicationsUnreachable stopTask');

	// stop task
	PubSub.publish('server', {
		event: 'task',
		command: 'stop',
		data: {
			taskname: this.taskName
		}
	});
};

TaskCommunicationsUnreachable.prototype.runFrame = function(joystick)
{
	debug.log('TaskCommunicationsUnreachable runFrame');

	// draw joystick lines
	var joyX = (joystick.axes[0] + 1.0) * 200;
	var joyY = (joystick.axes[1] + 1.0) * 200;

	var ok = false;
	var xl = Math.floor((joyX - 10) / 80);
	var xr = Math.floor((joyX + 10) / 80);
	var yl = Math.floor((joyY - 10) / 80);
	var yr = Math.floor((joyY + 10) / 80);

	if (yl*10+xl == yr*10+xr)
		ok = true;

	// handle dropping a dot - button release
	if (joystick.buttons[this.buttonIndex].pressed && joystick.buttons[this.buttonIndex].pressed != this.lastState)
	{
		// button click after last button click, wait until verification is done
		if (this.dots.length == this.dotsTotal)
		{
			return;
		}

		if (ok)
		{
			this.dots.push([joyX, joyY]);
			debug.debug('Adding dots', this.dots);
			$(".section-communications-unreachable .selection-result-" + (this.dots.length - 1) + ' .fa').attr("class", "fa fa-fw " + this.getIconMapForCoords(joyX, joyY).iconName);
			$(".section-communications-unreachable .selection-result-values .selection-result-box").removeClass('active');
		}
	}
	// store the state of the button press
	this.lastState = joystick.buttons[this.buttonIndex].pressed;

	// if button pressed (and holding down), freeze the lines
	if (this.lastState)
		return;

	// clear
	this.context.fillStyle = "black";
	this.context.fillRect(0, 0, 400, 400);
	this.context.lineWidth = 2;

	// draw the background
	this.context.strokeStyle = "#0099ff";
	for (var i = 0; i < 400; i += 80)
	{
		for (var j = 0; j < 400; j += 80)
		{
			this.context.strokeRect(i,j,80,80);
		}
	}

	// draw elements
	for (d in this.dots)
	{
		this.context.fillStyle = "#4db8ff";
		this.context.fillRect(Math.floor(this.dots[d][0] / 80) * 80, Math.floor(this.dots[d][1] / 80) * 80, 80, 80);
	}

	// we are at the last item, verify result
	if (this.dots.length == this.dotsTotal)
	{
		this.checkResults();
		return;
	}

	// fill ok hover items
	if (ok)
	{
		this.context.fillStyle = "#ffe3cc";
		this.context.fillRect(Math.floor(joyX / 80) * 80, Math.floor(joyY / 80) * 80, 80, 80);
	}

	// draw the icons
	this.context.fillStyle = "#0099ff";
	this.context.font='50px FontAwesome';
	for (var i = 0; i < 400; i += 80)
	{
		for (var j = 0; j < 400; j += 80)
		{
			this.context.fillText(this.getIconMapForCoords(i, j).icon, i+18, j+55);
		}
	}

	this.context.beginPath();
	this.context.arc(joyX, joyY, 10, 0, 2 * Math.PI, false);
	this.context.fillStyle = '#ff9d4d';
	this.context.fill();
	this.context.strokeStyle = '#f9f09f';
	this.context.stroke();

	this.context.fillStyle = "#f4e557";
	this.context.fillRect(joyX - 2, 0, 5, 400);
	this.context.fillRect(0, joyY - 2, 400, 5);
	this.context.fillStyle = "#ff9d4d";
	this.context.fillRect(joyX - 0, 0, 1, 400);
	this.context.fillRect(0, joyY - 0, 400, 1);

	// set the unlocked number
	$(".section-communications-unreachable .selection-result-" + (this.dots.length) + ' .fa').attr("class", "fa fa-fw " + this.getIconMapForCoords(joyX, joyY).iconName);
	$(".section-communications-unreachable .selection-result-values .selection-result-box").removeClass('active');
	$(".section-communications-unreachable .selection-result-" + (this.dots.length)).addClass('active');
};

TaskCommunicationsUnreachable.prototype.getIconMapForCoords = function(x, y)
{
	var res = {};
	x = Math.floor(x/80);
	y = Math.floor(y/80);
	// account for being at the exact edge
	if (x == 5)
		x = 4;
	if (y == 5)
		y = 4;
	var calc = x + y * 5;
	res.icon = this.iconMap[calc];
	res.iconName = this.iconNameMap[calc];
	return res;
};

TaskCommunicationsUnreachable.prototype.restartTask = function()
{
	this.dots = [];
	this.lastState = 1;
	this.resetInterface();
};

TaskCommunicationsUnreachable.prototype.resetInterface = function()
{
	$(".section-communications-unreachable .selection-result-values .selection-result-box i").attr("class", "fa fa-fw");
	$(".section-communications-unreachable .selection-result-values .selection-result-box").removeClass('active');
	$(".section-communications-unreachable .selection-result-status").hide();
	$(".section-communications-unreachable .selection-result-status p").hide();
};

TaskCommunicationsUnreachable.prototype.checkResults = function()
{
	if (this.resultStatus == 'none')
	{
		debug.debug('checkResults');
		$(".section-communications-unreachable .selection-result-status").show();
		$(".section-communications-unreachable .selection-result-status .attempt").show();
		PubSub.publish('server', {
			event: 'task',
			command: 'check',
			data: {
				taskname: this.taskName,
				result: [
					this.getIconMapForCoords(this.dots[0][0], this.dots[0][1]).iconName,
					this.getIconMapForCoords(this.dots[1][0], this.dots[1][1]).iconName,
					this.getIconMapForCoords(this.dots[2][0], this.dots[2][1]).iconName,
					this.getIconMapForCoords(this.dots[3][0], this.dots[3][1]).iconName
				]
			}
		});
		this.resultStatus = 'checking';
	}
};

TaskCommunicationsUnreachable.prototype.processResults = function(result)
{
	var self = this;

	debug.debug('processResults:', result);
	if (result)
	{
		this.resultStatus = 'success';
		$(".section-communications-unreachable .selection-result-status p").hide();
		$(".section-communications-unreachable .selection-result-status .success").show();
		setTimeout(function(){
			self.stopTask();
			PubSub.publish('stateNext', {group: 'communications'});
		}, this.timeLengthGlobalTaskResult);
	}
	else
	{
		this.resultStatus = 'error';
		$(".section-communications-unreachable .selection-result-status p").hide();
		$(".section-communications-unreachable .selection-result-status .error").show();
		setTimeout(function(){
			self.resultStatus = 'none';
			self.restartTask();
		}, this.timeLengthGlobalTaskResult);
	}
};