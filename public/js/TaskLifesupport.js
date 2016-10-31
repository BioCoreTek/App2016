
function TaskLifesupport()
{
	this.taskName = 'TaskLifesupport';
	// static
	this.context;
	this.dotsTotal = 4;
	this.buttonIndex = config.get('triggerButtonIndex');
	this.resetButtonIndex = config.get('resetButtonIndex');

	this.dots = [];
	this.lastState = 1;

	// none, checking, error, success
	this.resultStatus = 'none';

	this.domMeterBar;
	this.domMeterVal;

	// meterMin - meterMax
	this.meterValue;

	this.meterMin = 8;
	this.meterMax = 86;

	this.meterInt;

	this.pubSubs = [];

	this.timeLengthGlobalTaskResult = config.get('eventTimes')['GlobalTaskResult'];
};

TaskLifesupport.prototype.init = function()
{
	var self = this;

	debug.debug('TaskLifesupport init');

	this.startTask();

	this.domMeterBar = $(".section-lifesupport-failure .oxygen-level");
	this.domMeterVal = $(".section-lifesupport-failure .oxygen-percent");

	PubSub.publish('audio', {name: 'alarm', action: 'play', loop: true});
	PubSub.publish('audio', {name: 'o2', action: 'play', loop: true});

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
			debug.debug('TaskLifesupport PubSub sub task', msg, data);
			if (data && data.taskname == self.taskName)
				self.processResults(data.result);
		})
	);

	// turn off fake fluxtuation in statsChart
	PubSub.publish('stats', {event: 'fluxtuations', command: 'stop', name: 'Oxygen'});
	this.meterValue = this.meterMax;
	this.runMeter();
};

// to be called when game exists
TaskLifesupport.prototype.exit = function()
{
	clearInterval(this.meterInt);
	PubSub.publish('audio', {name: 'alarm', action: 'stop'});
	PubSub.publish('audio', {name: 'o2', action: 'stop'});

	// remove pubsubs
	for (var i = 0, len = this.pubSubs.length; i < len; i++)
	{
		PubSub.unsubscribe(this.pubSubs[i]);
	}
	PubSub.publish('stats', {event: 'fluxtuations', command: 'start', name: 'Oxygen'});
};

TaskLifesupport.prototype.startTask = function()
{
	debug.log('TaskLifesupport startTask');

	// start task
	PubSub.publish('server', {
		event: 'task',
		command: 'start',
		data: {
			taskname: this.taskName
		}
	});
};

TaskLifesupport.prototype.stopTask = function()
{
	debug.log('TaskLifesupport stopTask');

	// stop task
	PubSub.publish('server', {
		event: 'task',
		command: 'stop',
		data: {
			taskname: this.taskName
		}
	});
};

TaskLifesupport.prototype.runMeter = function()
{
	var self = this;

	this.meterInt = setInterval(function() {
		if (self.resultStatus != 'success' && self.meterValue > self.meterMin)
			self.meterValue--;
		if (self.resultStatus == 'success' && self.meterValue < self.meterMax)
			self.meterValue++;
		debug.log('TaskLifesupport runMeter meterValue', self.meterValue, self.domMeterBar);
		self.domMeterBar.width(self.meterValue+'%');
		self.domMeterVal.html(self.meterValue+'%');
		PubSub.publish('stats', {event: 'fluxtuations', command: 'set', name: 'Oxygen', value: self.meterValue});
	}, 800);
};


TaskLifesupport.prototype.runFrame = function(joystick)
{
	debug.log('TaskLifesupport runFrame');

	// draw joystick lines
	var joyX = (joystick.axes[0] + 1.0) * 200;
	var joyY = (joystick.axes[1] + 1.0) * 200;

	var ok = false;
	var xl = Math.floor((joyX - 10) / 40);
	var xr = Math.floor((joyX + 10) / 40);
	var yl = Math.floor((joyY - 10) / 40);
	var yr = Math.floor((joyY + 10) / 40);

	if (yl*10+xl == yr*10+xr)
		ok = true;

	// handle button reset
	if (joystick.buttons[this.resetButtonIndex].pressed && joystick.buttons[this.resetButtonIndex].pressed != this.lastState)
	{
		this.restartTask();
	}

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
			$(".section-lifesupport-failure .selection-result-" + this.dots.length - 1).html(this.getNumberForCoords(joyX, joyY));
			$(".section-lifesupport-failure .selection-result-values .selection-result-box").removeClass('active');
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
	for (var i = 0; i < 400; i += 40)
	{
		for (var j = 0; j < 400; j += 40)
		{
			this.context.strokeRect(i,j,40,40);
		}
	}

	// draw elements
	for (d in this.dots)
	{
		this.context.fillStyle = "#4db8ff";
		this.context.fillRect(Math.floor(this.dots[d][0] / 40) * 40, Math.floor(this.dots[d][1] / 40) * 40, 40, 40);
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
		this.context.fillRect(Math.floor(joyX / 40) * 40, Math.floor(joyY / 40) * 40, 40, 40);
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
	$(".section-lifesupport-failure .selection-result-" + (this.dots.length)).html(this.getNumberForCoords(joyX, joyY));
	$(".section-lifesupport-failure .selection-result-values .selection-result-box").removeClass('active');
	$(".section-lifesupport-failure .selection-result-" + (this.dots.length)).addClass('active');
};

TaskLifesupport.prototype.getNumberForCoords = function(x, y)
{
	x = Math.floor(x/40);
	y = Math.floor(y/40);
	// account for being at the exact edge
	if (x == 10)
		x = 9;
	if (y == 10)
		y = 9;
	// make it a string
	return x + "" + y;
};

TaskLifesupport.prototype.restartTask = function()
{
	this.dots = [];
	this.lastState = 1;
	this.resetInterface();
};

TaskLifesupport.prototype.resetInterface = function()
{
	$(".section-lifesupport-failure  .selection-result-values .selection-result-box").html("");
	$(".section-lifesupport-failure .selection-result-values .selection-result-box").removeClass('active');
	$(".section-lifesupport-failure .selection-result-status").hide();
	$(".section-lifesupport-failure .selection-result-status p").hide();
};

TaskLifesupport.prototype.checkResults = function()
{
	if (this.resultStatus == 'none')
	{
		debug.debug('checkResults');
		$(".section-lifesupport-failure .selection-result-status").show();
		$(".section-lifesupport-failure .selection-result-status .attempt").show();
		PubSub.publish('server', {
			event: 'task',
			command: 'check',
			data: {
				taskname: this.taskName,
				result: [
					Math.floor(this.dots[0][0] / 40) + "" + Math.floor(this.dots[0][1] / 40),
					Math.floor(this.dots[1][0] / 40) + "" + Math.floor(this.dots[1][1] / 40),
					Math.floor(this.dots[2][0] / 40) + "" + Math.floor(this.dots[2][1] / 40),
					Math.floor(this.dots[3][0] / 40) + "" + Math.floor(this.dots[3][1] / 40)
				]
			}
		});
		this.resultStatus = 'checking';
	}
};
TaskLifesupport.prototype.processResults = function(result)
{
	var self = this;

	debug.debug('processResults:', result);
	if (result)
	{
		this.resultStatus = 'success';
		$(".section-lifesupport-failure .selection-result-status p").hide();
		$(".section-lifesupport-failure .selection-result-status .success").show();
		setTimeout(function(){
			self.stopTask();
			PubSub.publish('stateNext', {group: 'lifesupport'});
		}, this.timeLengthGlobalTaskResult);
	}
	else
	{
		this.resultStatus = 'error';
		$(".section-lifesupport-failure .selection-result-status p").hide();
		$(".section-lifesupport-failure .selection-result-status .error").show();
		setTimeout(function(){
			self.resultStatus = 'none';
			self.restartTask();
		}, this.timeLengthGlobalTaskResult);
	}
};