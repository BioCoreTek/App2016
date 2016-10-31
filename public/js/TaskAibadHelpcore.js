
function TaskAibadHelpcore()
{
	this.taskName = 'TaskAibadHelpcore';

	this.timeLengthContent = config.get('eventTimes')['TaskAibadHelpcore'];
};

TaskAibadHelpcore.prototype.init = function()
{
	var self = this;

	//AI text
	var AItext = "My apologies for this malfunction. Please proceed to comply with your orders. You will require access to the Core Processor. I can provide you with the following message to assist you.";

	//initialize and run the visualization...
	//(AiVisuals.js)

	//run the animation!
	AIsetParams("bad");
	AIinit("AIContainer4");
	AIanimate();


	//make the AI speak (AiSpeech.js)
	say(AItext, function(){

		//clear the timeout if this successfully runs...
		//clearTimeout(AItimeout);

		// just hide the modal when content is done
		//PubSub.publish('modal', {action: 'hide'});
		// go to the life support screen
		PubSub.publish('goToGroup', {group: 'aibad'});
	});

	/*
	setTimeout(function() {
		// just hide the modal when content is done
		// don't hide modal since we know we are going to another modal
		//PubSub.publish('modal', {action: 'hide'});
		// go to the bad ai
		PubSub.publish('stateNext', {group: 'aibad'});
	}, this.timeLengthContent);
	*/
};