
function AudioManager()
{
	this.audioFiles = {
		'alarm': 'audio/alarm.ogg'
	};
	// don't play a sound over another!
	this.currentAudioName = null;
	this.currentAudioObj = null;
};

AudioManager.prototype.init = function()
{
	var self = this;

	PubSub.subscribe('audio', function(msg, data)
	{
		debug.debug('AudioManager PubSub sub audio', msg, data);
		if (data.action == 'play')
			self.play(data);
		if (data.action == 'stop')
			self.stop(data);
	});
};

AudioManager.prototype.play = function(data)
{
	debug.debug('AudioManager play');
	if (this.currentAudioName == data.name)
	{
		debug.debug('Already playing audio:', data.name);
		return;
	}

	// stop any ongoing audio
	this.stop();

	this.currentAudioObj = new Audio(this.audioFiles[data.name]);
	this.currentAudioName = data.name;
	if (data.loop)
		this.currentAudioObj.loop = true;
	this.currentAudioObj.play();
};

AudioManager.prototype.stop = function(data)
{
	debug.debug('AudioManager stop');
	if (this.currentAudioObj)
	{
		// if a specific audio is requested to stop
		// else, stop anything playing
		if (data && data.name && data.name != this.currentAudioName)
		{
			debug.debug('AudioManager stop is not playing requested sound to stop:', data.name);
		}
		this.currentAudioObj.pause();
		this.currentAudioObj = null;
		this.currentAudioName = null;
	}
};