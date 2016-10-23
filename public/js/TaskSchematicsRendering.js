
function TaskSchematicsRendering()
{
	this.taskName = 'TaskSchematicsRendering';
};

TaskSchematicsRendering.prototype.init = function()
{
	var self = this;

	debug.debug('TaskSchematicsRendering init');

	this.startTask();
};

TaskSchematicsRendering.prototype.startTask = function()
{
	var self = this;

	debug.log('TaskSchematicsRendering startTask');

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

TaskSchematicsRendering.prototype.stopTask = function()
{
	debug.log('TaskSchematicsRendering stopTask');

	// stop task
	PubSub.publish('server', {
		event: 'task',
		command: 'stop',
		data: {
			taskname: this.taskName
		}
	});
};