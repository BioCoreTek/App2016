
function TaskShieldsApp()
{
	this.taskName = 'TaskShieldsApp';
};

TaskShieldsApp.prototype.init = function()
{
	var self = this;

	debug.debug('TaskShieldsApp init');

	PubSub.subscribe('task', function(msg, data)
	{
		debug.debug('TaskLifesupport PubSub sub task', msg, data)
		if (data && data.taskname == self.taskName)
			self.processResults(data.result);
	});

	this.startTask();
};

TaskShieldsApp.prototype.startTask = function()
{
	var self = this;

	debug.log('TaskShieldsApp startTask');

	// start task
	PubSub.publish('server', {
		event: 'task',
		command: 'start',
		data: {
			taskname: this.taskName
		}
	});

	// end task after some time
	setTimeout(function(){
		self.stopTask();
		PubSub.publish('stateNext', {group: 'schematics'});
	}, 2000);
};

TaskShieldsApp.prototype.stopTask = function()
{
	debug.log('TaskShieldsApp stopTask');

	// stop task
	PubSub.publish('server', {
		event: 'task',
		command: 'stop',
		data: {
			taskname: this.taskName
		}
	});
};