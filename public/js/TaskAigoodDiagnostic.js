
function TaskAigoodDiagnostic()
{
	this.taskName = 'TaskAigoodDiagnostic';

	// length of time to wait to close modal in milliseconds
	this.timeLengthContent = config.get('eventTimes')['TaskAigoodDiagnostic'];
};

TaskAigoodDiagnostic.prototype.init = function()
{
	var self = this;

	//AI text
	var AItext = "Welcome to the Aura, I have been offline for 4 days, 6 hours and 52 minutes. I require a system diagnostic. Please use the manual console until my return.";

	//initialize and run the visualization...
	//(AiVisuals.js)

	//run the animation!
	AIsetParams("good");
	AIinit("AIContainer1");
	AIanimate();


	//make the AI speak (AiSpeech.js)
	say(AItext, function(){

		//clear the timeout if this successfully runs...
		//clearTimeout(AItimeout);

		// just hide the modal when content is done
		PubSub.publish('modal', {action: 'hide'});
		// go to the life support screen
		PubSub.publish('goToGroup', {group: 'lifesupport'});
	});

	//set a timeout just in case the callback fails for some reason...
	/*
	var AItimeout = setTimeout(function() {
		// just hide the modal when content is done
		PubSub.publish('modal', {action: 'hide'});
		// go to the life support screen
		PubSub.publish('goToGroup', {group: 'lifesupport'});
	}, this.timeLengthContent);
	*/

};