var DEV = true;

var config;
var spaceServer;
var stateManager;
var statsChart;
var section;
var gamePad;
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
	spaceServer.init();

	notifications = new Notifications();
	notifications.init();

	statsChart = new StatsChart();
	statsChart.init();

	section = new Sections();
	section.init();

	gamePad = new GamePad();
	gamePad.init();

	modal = new Modal();
	modal.init();

	timer = new Timer();
	timer.init();

	stateManager = new StateManager();
	stateManager.init(stateConfig);

	if (DEV)
		setupDev();

	// run the app now
	stateManager.goToGroup("lifesupport");
}


///////////////////////////////////////////////////////////////////////////////

// run on startup
$(function() {
	init();
});