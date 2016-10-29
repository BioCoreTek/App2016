
function TaskAigoodIncinerator()
{
	this.taskName = 'TaskAigoodIncinerator';

	this.timeLengthContent = config.get('eventTimes')['TaskAigoodIncinerator'];
};

TaskAigoodIncinerator.prototype.init = function()
{
	var self = this;

	setTimeout(function() {
		// just hide the modal when content is done
		PubSub.publish('modal', {action: 'hide'});
		// go to the shields
		PubSub.publish('stateNext', {group: 'shields'});
		PubSub.publish('goToGroup', {group: 'shields'});
	}, this.timeLengthContent);
};