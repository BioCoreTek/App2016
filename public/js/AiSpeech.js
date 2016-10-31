/**
 * Created by jeffdaze on 2016-10-30.
 */
//speech handlers...
//init speechSynthesis API

speechInit();

function speechInit(){
	speechSynthesis.onvoiceschanged = function() {
		//these don't even need to be printed, just handled for the voices to be enumerated...
		speechSynthesis.getVoices().forEach(function(voice, index) {
			//console.log(voice, index);
		});
	};
}

//speech method...
function say(text, callback)
{

	var msg = new SpeechSynthesisUtterance();
	//var voices = window.speechSynthesis.getVoices();

	var voices = speechSynthesis.getVoices();

	msg.voice = voices[config.get('voiceIndex')];
	//msg.rate = $('#rate').val() / 10;
	//msg.pitch = $('#pitch').val();
	msg.text = text;

	//callback...
	msg.onend = function(e) {

		//for some reason this event needs to be handled or it won't process the callback...
		console.log("e", e);
		//console.log('Finished in ' + event.elapsedTime + ' seconds.');

		//run the callback...
		callback();

	};

	speechSynthesis.speak(msg);
}