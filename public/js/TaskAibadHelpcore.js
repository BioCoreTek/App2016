
function TaskAibadHelpcore()
{
	this.taskName = 'TaskAibadHelpcore';

	this.timeLengthContent = config.get('eventTimes')['TaskAibadHelpcore'];
};

TaskAibadHelpcore.prototype.init = function()
{
	var self = this;

	setTimeout(function() {
		// just hide the modal when content is done
		PubSub.publish('modal', {action: 'hide'});
		// go to the bad ai
		PubSub.publish('stateNext', {group: 'aibad'});
	}, this.timeLengthContent);
};