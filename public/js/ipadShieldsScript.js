/**
 * Created by jeffdaze on 2016-10-20.
 */
var DEV = false;
var CONTROLLER = 'joystick';

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

	if (DEV)
		setupDev();

	// run the app now
	stateManager.goToGroup("ipadshields");
}

///////////////////////////////////////////////////////////////////////////////

// run on startup
$(function() {
	init();
});