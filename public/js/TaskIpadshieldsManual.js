
function TaskIpadshieldsManual()
{
	this.taskName = 'TaskIpadshieldsManual';

	this.pubSubs = [];
};

TaskIpadshieldsManual.prototype.init = function()
{
	var self = this;

	debug.debug('TaskIpadshieldsManual init');

	//add touchstart and touchend states for the button...
	$("body").on({"touchstart":function(e){
		self.doPress();
		$(".moc i").css("color", "#47A8BD");
	}});

	$("body").on({"touchend":function(e){
		self.doRelease();
		$(".moc i").css("color", "#ff9d4d");
	}});

	this.pubSubs.push(
		PubSub.subscribe('task', function(msg, data)
		{
			debug.debug('TaskIpadshieldsManual PubSub sub task', msg, data);
			if (data && data.taskname == self.taskName)
				self.processResults(data.result);
		})
	);

	this.startTask();
};

// to be called when game exists
TaskIpadshieldsManual.prototype.exit = function()
{
	// remove pubsubs
	for (var i = 0, len = this.pubSubs.length; i < len; i++)
	{
		PubSub.unsubscribe(this.pubSubs[i]);
	}
};

TaskIpadshieldsManual.prototype.startTask = function()
{
	var self = this;

	debug.log('TaskIpadshieldsManual startTask');

	// start task
	PubSub.publish('server', {
		event: 'task',
		command: 'start',
		data: {
			taskname: this.taskName
		}
	});
};

TaskIpadshieldsManual.prototype.stopTask = function()
{
	debug.log('TaskIpadshieldsManual stopTask');

	// stop task
	PubSub.publish('server', {
		event: 'task',
		command: 'stop',
		data: {
			taskname: this.taskName
		}
	});
};

TaskIpadshieldsManual.prototype.doPress = function()
{
	debug.log('TaskIpadshieldsManual doPress');

	// stop task
	PubSub.publish('server', {
		event: 'task',
		command: 'check',
		data: {
			taskname: this.taskName,
			result: 'press'
		}
	});
};

TaskIpadshieldsManual.prototype.doRelease = function()
{
	debug.log('TaskIpadshieldsManual doRelease');

	// stop task
	PubSub.publish('server', {
		event: 'task',
		command: 'check',
		data: {
			taskname: this.taskName,
			result: 'release'
		}
	});
};