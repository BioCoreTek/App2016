/**
 * Created by jeffdaze on 2016-10-20.
 */
var DEV = true;

var config;
var stateManager;
var section;
var notifications;
var modal;
var timer;

///////////////////////////////////////////////////////////////////////////////

function init()
{
	debug.setLevel(0);
	if (DEV)
		debug.setLevel(4);
	debug.debug('Run this in Chrome: document.documentElement.webkitRequestFullscreen();');

	config = new Config();

	spaceServer = new SpaceServer();
	spaceServer.init('ipadShields');

	section = new Sections();
	section.init();

	stateManager = new StateManager();
	stateManager.init(stateConfig);

	//enable the touch button!
	activateManualOverride();

	if (DEV)
		setupDev();

	// run the app now
	stateManager.goToGroup("ipadshields");
}

function activateManualOverride()
{
	//add touchstart and touchend states for the button...
	$("body").on({"touchstart":function(e){
	 	console.log("TOUCHED THE BUTTON!!!");
		$(".moc i").css("color", "#47A8BD");
	}});

	$("body").on({"touchend":function(e){
	 	console.log("RELEASED THE BUTTON!!!");
		$(".moc i").css("color", "#ff9d4d");
	}});


}
///////////////////////////////////////////////////////////////////////////////

// run on startup
$(function() {
	init();
});