
function TaskShieldsManual()
{
	this.taskName = 'TaskShieldsManual';

};

TaskShieldsManual.prototype.init = function()
{
	var self = this;

	PubSub.publish('audio', {name: 'alarm', action: 'play', loop: true});
};

// to be called when game exists
TaskShieldsManual.prototype.exit = function()
{
	PubSub.publish('audio', {name: 'alarm', action: 'stop'});
};
