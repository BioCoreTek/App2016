
function TaskAigoodDiagnostic()
{
	this.taskName = 'TaskAigoodDiagnostic';

	// length of time to wait to close modal in milliseconds
	this.timeLengthContent = config.get('eventTimes')['TaskAigoodDiagnostic'];
};

TaskAigoodDiagnostic.prototype.init = function()
{
	var self = this;

	setTimeout(function() {
		// just hide the modal when content is done
		PubSub.publish('modal', {action: 'hide'});
		// go to the life support screen
		PubSub.publish('goToGroup', {group: 'lifesupport'});
	}, this.timeLengthContent);
};