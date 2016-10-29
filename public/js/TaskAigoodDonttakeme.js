
function TaskAigoodDonttakeme()
{
	this.taskName = 'TaskAigoodDonttakeme';

	this.timeLengthContent = config.get('eventTimes')['TaskAigoodDonttakeme'];
};

TaskAigoodDonttakeme.prototype.init = function()
{
	var self = this;

	setTimeout(function() {
		// just hide the modal when content is done
		// don't hide modal since we know we are going to another modal
		//PubSub.publish('modal', {action: 'hide'});
		// go to the bad ai
		PubSub.publish('goToGroup', {group: 'aibad'});
	}, this.timeLengthContent);
};