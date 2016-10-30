
function TaskShieldsManual()
{
	this.taskName = 'TaskShieldsManual';
	this.ipadTaskName = 'TaskIpadShieldsManual';

	// the state of the button press from ipad
	// release or press
	this.resultCheck = 'release';

	this.domMeterBar;
	this.domMeterVal;

	// 0-100
	this.meterValue = 6;

	this.meterMin = 6;
	this.meterMax = 97;

	this.meterInt;

	this.pubSubs = [];
};

TaskShieldsManual.prototype.init = function()
{
	var self = this;

	this.startTask();

	this.domMeterBar = $(".section-shields-manual .radiation-level");
	this.domMeterVal = $(".section-shields-manual .radiation-percent");

	PubSub.publish('audio', {name: 'alarm', action: 'play', loop: true});

	this.pubSubs.push(
		PubSub.subscribe('task', function(msg, data)
		{
			debug.debug('TaskShieldsManual PubSub sub task', msg, data);
			if (data && data.taskname == self.taskName)
			{
				if (data.command == 'result')
					self.processResults(data.result);
			}
			if (data && data.taskname == self.ipadTaskName)
			{
				if (data.command == 'check')
					self.processCheck(data.result);
			}
		})
	);

	// turn off fake fluxtuation in statsChart
	PubSub.publish('stats', {event: 'fluxtuations', command: 'stop', name: 'Radiation'});
	this.meterValue = this.meterMin;
	this.runMeter();
};

// to be called when game exists
TaskShieldsManual.prototype.exit = function()
{
	clearInterval(this.meterInt);
	PubSub.publish('audio', {name: 'alarm', action: 'stop'});
	PubSub.publish('stats', {event: 'fluxtuations', command: 'start', name: 'Radiation'});
};

TaskShieldsManual.prototype.startTask = function()
{
	debug.log('TaskShieldsManual startTask');

	// start task
	PubSub.publish('server', {
		event: 'task',
		command: 'start',
		data: {
			taskname: this.taskName
		}
	});
};

TaskShieldsManual.prototype.stopTask = function()
{
	debug.log('TaskShieldsManual stopTask');

	// stop task
	PubSub.publish('server', {
		event: 'task',
		command: 'stop',
		data: {
			taskname: this.taskName
		}
	});
};

TaskShieldsManual.prototype.processCheck = function(result)
{
	var self = this;

	debug.debug('TaskShieldsManual processCheck:', result);
	if ("press" == result)
	{
		this.resultCheck = 'press';
		$(".section-shields-manual .control-panel i").addClass('pressed');
		this.runMeter();
	}
	else // release
	{
		this.resultCheck = 'release';
		$(".section-shields-manual .control-panel i").removeClass('pressed');
	}
};

TaskShieldsManual.prototype.processResults = function(result)
{
	var self = this;

	debug.debug('TaskShieldsManual processResults:', result);
	if (result)
	{
		setTimeout(function(){
			self.stopTask();
			PubSub.publish('stateNext', {group: 'shields'});
			PubSub.publish('goToGroup', {group: 'shields'});
		}, this.timeLengthGlobalTaskResult);
	}
};

TaskShieldsManual.prototype.runMeter = function()
{
	var self = this;

	this.meterInt = setInterval(function() {
		if (self.resultCheck == 'press' && self.meterValue > self.meterMax)
			self.meterValue = self.meterValue - 1;
		if (self.resultCheck == 'release' && self.meterValue < self.meterMax)
			self.meterValue = self.meterValue + 1;
		debug.debug('TaskShieldsManual runMeter meterValue', self.meterValue, self.domMeterBar);
		self.domMeterBar.width(self.meterValue+'%');
		self.domMeterVal.html(self.meterValue+'%');
		PubSub.publish('stats', {event: 'fluxtuations', command: 'set', name: 'Radiation', value: self.meterValue});
	}, 500);
};