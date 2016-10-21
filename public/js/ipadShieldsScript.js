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

	notifications = new Notifications();
	notifications.init();

	section = new Sections();
	section.init();

	modal = new Modal();
	modal.init();

	timer = new Timer();
	timer.init();

	stateManager = new StateManager();
	stateManager.init();

	//enable the touch button!
	activateManualOverride();

	if (DEV)
		setupDev();

	// run the app now
	stateManager.goToGroup("ipadShields");
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