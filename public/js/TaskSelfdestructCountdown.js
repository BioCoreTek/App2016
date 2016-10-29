
function TaskSelfdestructCountdown()
{
	this.taskName = 'TaskSelfdestructCountdown';

};

TaskSelfdestructCountdown.prototype.init = function()
{
	var self = this;

	PubSub.publish('audio', {name: 'alarm', action: 'play', loop: true});

	// listen for timer states
	PubSub.subscribe('time', function(msg, data)
	{
		debug.debug('TaskSelfdestructCountdown PubSub sub time', msg, data);
		self.processTimeEvent(data);
	});
};

// to be called when game exists
TaskLifesupport.prototype.exit = function()
{
	PubSub.publish('audio', {name: 'alarm', action: 'stop'});
};

TaskSelfdestructCountdown.prototype.processTimeEvent = function(data)
{
	$(".modal-selfdestruct-countdown .countdown-clock").html(data.minutes + ":" + data.seconds);
};