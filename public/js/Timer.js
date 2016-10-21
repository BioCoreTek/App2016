////////////////////////////// TIMER //////////////////////////////////////////

function Timer()
{
	this.counterEl = $(".counter");
	this.timeupEl = $(".timeup");
	// total time a game last in milliseconds - 30 minutes
	this.totalTime = 30*60*1000;
	// time the game started in milliseconds
	this.startTime = null;
	// time the game stopped in milliseconds
	this.stopTime = null;
	// the current time as per last run time in the interval in milliseconds
	this.curTime = null;

	// array of pause objects
	// startTime - the start time of the pause in milliseconds
	// stopTime - the start time of the pause in milliseconds
	this.pauses = [];
	// the current pause object if currently paused
	this.currentPause = null;
	// the total number of milliseconds the game was paused
	this.pauseTotalTime = 0;

	// the interval object
	this.intTimer = null;
};

Timer.prototype.init = function()
{
	var self = this;

	// listen for timer states
	PubSub.subscribe('timer', function(msg, data)
	{
		debug.debug('Timer PubSub sub timer', msg, data);
		self.processTimerEvent(data);
	});
};

Timer.prototype.processTimerEvent = function(data)
{
	debug.debug('Timer processTimerEvent', data);
	switch(data.event)
	{
		case 'start':
			this.startTime = new Date().getTime();
			this.startTimer();
			break;
		case 'pause':
			this.pauseTimer();
			break;
		case 'resume':
			this.resumeTimer();
			break;
		case 'stop':
			this.stopTimer();
			this.stopTime = this.curTime;
			break;
	}
};

Timer.prototype.drawTime = function()
{
	debug.log('Timer drawTime');
	var elapsed = this.curTime - this.startTime - this.pauseTotalTime;

	if (elapsed >= this.totalTime)
	{
		debug.log('Timer out of time!');
		this.stopTimer();
		elapsed = this.totalTime;
		this.counterEl.hide();
		this.timeupEl.show();
	}

	var timeLeft = this.totalTime - elapsed;
	var minutes = Math.floor(timeLeft/(1000*60));
	var r = timeLeft - (minutes*1000*60);
	var seconds = Math.floor(r/1000);
	if (minutes < 10)
		minutes = '0'+minutes;
	if (seconds < 10)
		seconds = '0'+seconds;
	this.counterEl.html(minutes+':'+seconds);
};

Timer.prototype.startTimer = function()
{
	debug.debug('Timer startTimer');

	var self = this;

	this.intTimer = setInterval(function()
	{
		self.curTime = new Date().getTime();
		self.drawTime();
	}, 500);
};

Timer.prototype.stopTimer = function()
{
	debug.debug('Timer stopTimer');

	clearInterval(this.intTimer);
};

Timer.prototype.pauseTimer = function()
{
	debug.debug('Timer pauseTimer');
	this.stopTimer();
	var p = {
		startTime: new Date().getTime(),
		stopTime: null
	};
	this.pauses.push(p);
	this.currentPause = this.pauses[this.pauses.length-1];
};

Timer.prototype.resumeTimer = function()
{
	debug.debug('Timer resumeTimer');
	this.currentPause.stopTime = new Date().getTime();
	var t = this.currentPause.stopTime - this.currentPause.startTime;
	this.pauseTotalTime += t;
	this.currentPause = null;
	this.startTimer();
};