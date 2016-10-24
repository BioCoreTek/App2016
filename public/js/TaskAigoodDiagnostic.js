
function TaskAigoodDiagnostic()
{
	this.taskName = 'TaskAigoodDiagnostic';

	// length of time to wait to close modal in milliseconds
	this.contentLength = 4000;
};

TaskAigoodDiagnostic.prototype.init = function()
{
	var self = this;

	setTimeout(function() {
		// just hide the modal when content is done
		PubSub.publish('modal', {action: 'hide'});
	}, this.contentLength);
};