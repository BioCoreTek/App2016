var DEV = false;
var CONTROLLER = 'joystick'; // ps, joystick

// tv size: 1800x1000px

var config;
var spaceServer;
var stateManager;
var statsChart;
var section;
var gamePad;
var notifications;
var modal;
var timer;
var audioManager;

///////////////////////////////////////////////////////////////////////////////

function init()
{
	debug.debug('Run this in Chrome: document.documentElement.webkitRequestFullscreen();');
	debug.setLevel(0);
	if (DEV)
		debug.setLevel(4);

	config = new Config();

	spaceServer = new SpaceServer();
	spaceServer.init('appConsole');

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

	audioManager = new AudioManager();
	audioManager.init();

	stateManager = new StateManager();
	stateManager.init(stateConfig);

	if (DEV)
		setupDev();

	waitGame();
}

function waitGame()
{
	var ps = PubSub.subscribe('status', function(msg, data)
	{
		debug.debug('waitGame', msg, data);
		if ("Ready to play" == data.status)
		{
			// clear the pubsub
			PubSub.unsubscribe(ps);
			runReboot();
		}
		if ("Playing" == data.status)
		{
			// clear the pubsub
			PubSub.unsubscribe(ps);
			rebootClicked();
		}
	});
}

function runReboot()
{
	var buttonIndex = config.get('triggerButtonIndex');

	// trigger button click
	var ps = PubSub.subscribe('gamePadLoop', function(msg, joystick)
	{
		if (joystick.buttons[buttonIndex].pressed)
		{
			// clear the pubsub
			PubSub.unsubscribe(ps);
			rebootClicked();
		}
	});
	$(".wait-game").hide();
	$(".reboot-button").show();
	// mouse button click
	$(".reboot-button").click(function(e) {
		// clear the pubsub
		PubSub.unsubscribe(ps);
		rebootClicked();
	});
}

function rebootClicked()
{
	$(".wait-game").hide();
	$(".reboot-button").hide();
	$(".reboot-loading").show();

	setTimeout(function() {
		$(".reboot-container").hide();
		$(".main-container").show();
/*
		// set game mode
		PubSub.publish('server', {
			event: 'game',
			command: (DEV) ? 'dev' : 'normal'
		});
*/
		PubSub.publish('server', {
			event: 'game',
			command: 'start'
		});

		// run the app now
		// run the section in background
		stateManager.goToGroup("lifesupport");

		// wait a pause, then show ai
		setTimeout(function() {
			// run the modal
			stateManager.goToGroup("aigood");
		}, config.get('eventTimes')['GlobalLaunchAI']);

	}, config.get('eventTimes')['GlobalAppLoad']);
}


///////////////////////////////////////////////////////////////////////////////

// run on startup
$(function() {
	init();
});