
function TaskSelfdestructCountdown()
{
	this.taskName = 'TaskSelfdestructCountdown';

	this.pubSubs = [];
};

TaskSelfdestructCountdown.prototype.init = function()
{
	var self = this;

	PubSub.publish('audio', {name: 'alarm', action: 'play', loop: true});

	// listen for timer states
	this.pubSubs.push(
		PubSub.subscribe('time', function(msg, data)
		{
			debug.debug('TaskSelfdestructCountdown PubSub sub time', msg, data);
			self.processTimeEvent(data);
		});
	);
};

// to be called when game exists
TaskLifesupport.prototype.exit = function()
{
	PubSub.publish('audio', {name: 'alarm', action: 'stop'});

	// remove pubsubs
	for (var i = 0, len = this.pubSubs.length; i < len; i++)
	{
		PubSub.unsubscribe(this.pubSubs[i]);
	}
};

TaskSelfdestructCountdown.prototype.processTimeEvent = function(data)
{
	$(".modal-selfdestruct-countdown .countdown-clock").html(data.minutes + ":" + data.seconds);
};