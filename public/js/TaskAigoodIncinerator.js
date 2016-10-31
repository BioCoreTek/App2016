
function TaskAigoodIncinerator()
{
	this.taskName = 'TaskAigoodIncinerator';

	this.timeLengthContent = config.get('eventTimes')['TaskAigoodIncinerator'];
};

TaskAigoodIncinerator.prototype.init = function()
{
	var self = this;

	//AI text
	var AItext = "You are too close. You will not succeed. A solar flare event is approaching. I have disabled the shields. BURN BURN BURN!";

	//initialize and run the visualization...
	//(AiVisuals.js)

	//run the animation!
	AIsetParams("good");
	AIinit("AIContainer2");
	AIanimate();


	//make the AI speak (AiSpeech.js)
	say(AItext, function(){

		//clear the timeout if this successfully runs...
		//clearTimeout(AItimeout);

		// just hide the modal when content is done
		PubSub.publish('modal', {action: 'hide'});
		// go to the shields
		PubSub.publish('stateNext', {group: 'shields'});
		PubSub.publish('goToGroup', {group: 'shields'});
	});

	/*
	setTimeout(function() {
		// just hide the modal when content is done
		PubSub.publish('modal', {action: 'hide'});
		// go to the shields
		PubSub.publish('stateNext', {group: 'shields'});
		PubSub.publish('goToGroup', {group: 'shields'});
	}, this.timeLengthContent);
	*/
};