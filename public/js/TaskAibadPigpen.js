
function TaskAibadPigpen()
{
	this.taskName = 'TaskAibadPigpen';
	// static
	this.context;
	this.dotsTotal = 14;
	this.buttonIndex = config.get('triggerButtonIndex');
	this.alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

	this.dots = [];
	this.lastState = 1;

	// none, checking, error, success
	this.resultStatus = 'none';

	this.pubSubs = [];

	this.timeLengthGlobalTaskResult = config.get('eventTimes')['GlobalTaskResult'];
};

TaskAibadPigpen.prototype.init = function()
{
	var self = this;

	debug.debug('TaskAibadPigpen init');

	this.startTask();

	var c = $('.modal canvas')[0];
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
			debug.debug('TaskAibadPigpen PubSub sub task', msg, data)
			if (data && data.taskname == self.taskName)
				self.processResults(data.result);
		})
	);
};

// to be called when game exists
TaskAibadPigpen.prototype.exit = function()
{
	// remove pubsubs
	for (var i = 0, len = this.pubSubs.length; i < len; i++)
	{
		PubSub.unsubscribe(this.pubSubs[i]);
	}
};

TaskAibadPigpen.prototype.startTask = function()
{
	debug.log('TaskAibadPigpen startTask');

	// start task
	PubSub.publish('server', {
		event: 'task',
		command: 'start',
		data: {
			taskname: this.taskName
		}
	});
};

TaskAibadPigpen.prototype.stopTask = function()
{
	debug.log('TaskAibadPigpen stopTask');

	// stop task
	PubSub.publish('server', {
		event: 'task',
		command: 'stop',
		data: {
			taskname: this.taskName
		}
	});
};

TaskAibadPigpen.prototype.runFrame = function(joystick)
{
	debug.log('TaskAibadPigpen runFrame');

	// draw joystick lines
	var joyX = (joystick.axes[0] + 1.0) * 390;
	var joyY = (joystick.axes[1] + 1.0) * 60;

	var ok = false;
	var xl = Math.floor((joyX - 10) / 60);
	var xr = Math.floor((joyX + 10) / 60);
	var yl = Math.floor((joyY - 10) / 60);
	var yr = Math.floor((joyY + 10) / 60);

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
			$(".modal-aibad-pigpen .selection-result-" + this.dots.length - 1).html(this.getLetterForCoords(joyX, joyY));
			$(".modal-aibad-pigpen .selection-result-values .selection-result-box").removeClass('active');
		}
	}
	// store the state of the button press
	this.lastState = joystick.buttons[this.buttonIndex].pressed;

	// if button pressed (and holding down), freeze the lines
	if (this.lastState)
		return;

	// clear
	this.context.fillStyle = "black";
	this.context.fillRect(0, 0, 780, 120);
	this.context.lineWidth = 2;

	// draw the background
	this.context.strokeStyle = "#0099ff";
	for (var i = 0; i < 780; i += 60)
	{
		for (var j = 0; j < 120; j += 60)
		{
			this.context.strokeRect(i,j,60,60);
		}
	}

	// draw elements
	for (d in this.dots)
	{
		this.context.fillStyle = "#4db8ff";
		this.context.fillRect(Math.floor(this.dots[d][0] / 60) * 60, Math.floor(this.dots[d][1] / 60) * 60, 60, 60);
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
		this.context.fillRect(Math.floor(joyX / 60) * 60, Math.floor(joyY / 60) * 60, 60, 60);
	}

	// draw the alphabet
	this.context.fillStyle = "#0099ff";
	this.context.font='60px monospace';
	for (var i = 0; i < 780; i += 60)
	{
		for (var j = 0; j < 120; j += 60)
		{
			this.context.fillText(this.getLetterForCoords(i, j), i+13, j+48);
		}
	}

	this.context.beginPath();
	this.context.arc(joyX, joyY, 10, 0, 2 * Math.PI, false);
	this.context.fillStyle = '#ff9d4d';
	this.context.fill();
	this.context.strokeStyle = '#f9f09f';
	this.context.stroke();

	this.context.fillStyle = "#f4e557";
	this.context.fillRect(joyX - 2, 0, 5, 780);
	this.context.fillRect(0, joyY - 2, 780, 5);
	this.context.fillStyle = "#ff9d4d";
	this.context.fillRect(joyX - 0, 0, 1, 120);
	this.context.fillRect(0, joyY - 0, 120, 1);

	// set the unlocked letter
	$(".modal-aibad-pigpen .selection-result-" + (this.dots.length)).html(this.getLetterForCoords(joyX, joyY));
	$(".modal-aibad-pigpen .selection-result-values .selection-result-box").removeClass('active');
	$(".modal-aibad-pigpen .selection-result-" + (this.dots.length)).addClass('active');
};

TaskAibadPigpen.prototype.getLetterForCoords = function(x, y)
{
	x = Math.floor(x/60);
	y = Math.floor(y/60);
	// account for being at the exact edge
	if (x == 13)
		x = 12;
	if (y == 2)
		y = 1;
	var calc = x + y * 13;
	var res = this.alphabet[calc];
	return res;
};

TaskAibadPigpen.prototype.restartTask = function()
{
	this.dots = [];
	this.lastState = 1;
	this.resetInterface();
};

TaskAibadPigpen.prototype.resetInterface = function()
{
	$(".modal-aibad-pigpen .selection-result-values .selection-result-box").html("");
	$(".modal-aibad-pigpen .selection-result-values .selection-result-box").removeClass('active');
	$(".modal-aibad-pigpen .selection-result-status").hide();
	$(".modal-aibad-pigpen .selection-result-status p").hide();
};

TaskAibadPigpen.prototype.checkResults = function()
{
	if (this.resultStatus == 'none')
	{
		debug.debug('checkResults');
		$(".modal-aibad-pigpen .selection-result-status").show();
		$(".modal-aibad-pigpen .selection-result-status .attempt").show();
		var res = [];
		for (var i = 0; i < this.dotsTotal; i++)
			res.push(this.getLetterForCoords(this.dots[i][0], this.dots[i][1]));
		PubSub.publish('server', {
			event: 'task',
			command: 'check',
			data: {
				taskname: this.taskName,
				result: res
			}
		});
		this.resultStatus = 'checking';
	}
};

TaskAibadPigpen.prototype.processResults = function(result)
{
	var self = this;

	debug.debug('processResults:', result);
	if (result)
	{
		this.resultStatus = 'success';
		$(".modal-aibad-pigpen .selection-result-status p").hide();
		$(".modal-aibad-pigpen .selection-result-status .success").show();
		setTimeout(function(){
			self.stopTask();
			PubSub.publish('stateNext', {group: 'aigood'});
			PubSub.publish('goToGroup', {group: 'aigood'});
		}, this.timeLengthGlobalTaskResult);
	}
	else
	{
		this.resultStatus = 'error';
		$(".modal-aibad-pigpen .selection-result-status p").hide();
		$(".modal-aibad-pigpen .selection-result-status .error").show();
		setTimeout(function(){
			self.resultStatus = 'none';
			self.restartTask();
		}, this.timeLengthGlobalTaskResult);
	}
};