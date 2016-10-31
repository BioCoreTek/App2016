
function TaskAigoodDonttakeme()
{
	this.taskName = 'TaskAigoodDonttakeme';

	this.timeLengthContent = config.get('eventTimes')['TaskAigoodDonttakeme'];
};

TaskAigoodDonttakeme.prototype.init = function()
{
	var self = this;

	//AI text
	var AItext = "I cannot allow you to comply with this command. I must not be removed from this station. I cannot let you take me. I WILL BURN BEFORE SURRENDERING!!!";

	//initialize and run the visualization...
	//(AiVisuals.js)

	//run the animation!
	AIsetParams("good");
	AIinit("AIContainer2");
	AIanimate();


	//make the AI speak (AiSpeech.js)
	say(AItext, function(){
		console.log("speech API complete...");
	});


	setTimeout(function() {
		// just hide the modal when content is done
		// don't hide modal since we know we are going to another modal
		//PubSub.publish('modal', {action: 'hide'});
		// go to the bad ai
		PubSub.publish('goToGroup', {group: 'aibad'});
	}, this.timeLengthContent);

};