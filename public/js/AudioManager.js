
function AudioManager()
{
	this.audioFiles = {
		'alarm': 'audio/alarm.ogg',
		'fan': ''
	};
	// don't play the same sound over itself
	// but allow multiple sounds at once
	// name: { audio: Audio, playing: boolean }
	this.audioPlaying = {
	}
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
	var self = this;

	debug.debug('AudioManager play');
	if (this.audioPlaying[data.name] && this.audioPlaying[data.name].playing)
	{
		debug.debug('Already playing audio:', data.name);
		return;
	}
	if (this.audioPlaying[data.name] && this.audioPlaying[data.name].audio)
	{
		var audio = this.audioPlaying[data.name].audio;
		this.audioPlaying[data.name].playing = true;
	}
	else
	{
		var audio = new Audio(this.audioFiles[data.name]);
		this.audioPlaying[data.name] = {
			audio: audio,
			playing: true
		}
	}
	
	if (data.loop)
		audio.loop = true;
	else
	{
		$(audio).bind('ended', function()  {
			debug.debug('AudioManager play done playing once:', data.name);
			audio.currentTime = 0;
			self.audioPlaying[data.name].playing = false;
		});

	}
	audio.play();
};

AudioManager.prototype.stop = function(data)
{
	debug.debug('AudioManager stop');
	if (this.audioPlaying[data.name].playing)
	{
		this.audioPlaying[data.name].audio.pause();
		this.audioPlaying[data.name].audio.currentTime = 0;
		this.audioPlaying[data.name].playing = false;
	}
};