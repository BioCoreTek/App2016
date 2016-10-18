var DEV = true;

var config;
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
	stateManager.init();

	if (DEV)
		setupDev();

	// run the app now
	stateManager.goToGroup("lifesupport");
}

function setupDev()
{
	// fake events with buttons for now
	$(".admin-event-bar button").click(function(e) {
		var id = $(this).attr('id');
		// take off the prefix: admin-
		var a = id.substring(6);
		var parts = a.split("-");

		if ($(this).hasClass('state'))
		{
			var interrupt = false;
			if ($(this).hasClass('interrupt'))
			{
				interrupt = true;
			}
			// fake a server publish event
			PubSub.publish('event', {
				group: parts[0],
				state: parts[1],
				interrupt: interrupt
			});
		}

		if ($(this).hasClass('timer'))
		{
			// fake a server publish timer
			PubSub.publish('timer', {
				event: parts[0]
			});

		}
	});
	$('.admin-event-bar').show();

}

///////////////////////////////////////////////////////////////////////////////

// run on startup
$(function() {
	init();
});