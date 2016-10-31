
function TaskCommunicationsTransmission()
{
	this.taskName = 'TaskCommunicationsTransmission';

	this.timeLengthContent = config.get('eventTimes')['TaskCommunicationsTransmissionVideo'];
	// states of ui 1-4
	this.timeoutState = 0;
	// length in milliseconds of each timeout
	this.timeoutDurations = [
		config.get('eventTimes')['TaskCommunicationsTransmissionState1'],
		config.get('eventTimes')['TaskCommunicationsTransmissionState2'],
		config.get('eventTimes')['TaskCommunicationsTransmissionState3'],
		config.get('eventTimes')['TaskCommunicationsTransmissionState4']
	];
};

TaskCommunicationsTransmission.prototype.init = function()
{
	var self = this;

	this.runTimeout(this.timeoutState);
};

// to be called when game exists
TaskCommunicationsTransmission.prototype.exit = function()
{
	// stop the video
	$(".section-communications-transmission video").get(0).pause();
	$(".section-communications-transmission video").get(0).currentTime = 0;
};

TaskCommunicationsTransmission.prototype.runTimeout = function(state)
{
	var self = this;

	setTimeout(function() {
		if (self.timeoutState == 4)
		{
			self.runVideo();
			return;
		}
		self.timeoutState++;
		$(".section-communications-transmission .row").hide();
		$(".section-communications-transmission .row.row"+self.timeoutState).show();
		self.runTimeout(self.timeoutState);

	}, this.timeoutDurations[state]);
};
TaskCommunicationsTransmission.prototype.runVideo = function(state)
{
	// play the video
	$(".section-communications-transmission video").get(0).play();


	setTimeout(function() {
		// show end transmission for communication state
		PubSub.publish('stateNext', {group: 'communications'});
		// go to the ai modal screen
		PubSub.publish('stateNext', {group: 'aigood'});
		PubSub.publish('goToGroup', {group: 'aigood'});
	}, this.timeLengthContent);

};