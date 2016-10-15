var config;
var stateManager;
var statsChart;
var section;
var gamePad;
var notifications;

///////////////////////////////////////////////////////////////////////////////

function init()
{
	debug.debug('Run this in Chrome: document.documentElement.webkitRequestFullscreen();');
	debug.setLevel(4);

	config = new Config();

	notifications = new Notifications();
	notifications.init();

	statsChart = new StatsChart();
	statsChart.init();

	section = new Sections();
	section.init();

	gamePad = new GamePad();
	gamePad.init(config.get('buttonMap'));

	stateManager = new StateManager();
	stateManager.init();

	// DEV ONLY START //
	// fake events with buttons for now
	$(".admin-event-bar button").click(function(e) {
		var id = $(this).attr('id');
		// take off the prefix: admin-
		var a = id.substring(6);
		var parts = a.split("-");
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
	});
	// DEV ONLY END //

	// run the app now
	stateManager.goToGroup("lifesupport");
}



///////////////////////////////////////////////////////////////////////////////
//---------------------------------------- 
// OXYGEN

var context;
var dots = [];
var dotsTotal = 4;
var laststate = 1;
function OxygenMain(context, joystick)
{
	// draw joystick lines
	var joyX = (joystick.axes[0] + 1.0) * 200;
	var joyY = (joystick.axes[1] + 1.0) * 200;

	var ok = false;
	var xl = Math.floor((joyX - 10) / 40);
	var xr = Math.floor((joyX + 10) / 40);
	var yl = Math.floor((joyY - 10) / 40);
	var yr = Math.floor((joyY + 10) / 40);

	if (yl*10+xl == yr*10+xr) ok = true;

	// handle dropping a dot
	if (joystick.buttons[0].pressed && joystick.buttons[0].pressed != laststate)
	{
		// start over game
		if (dots.length == dotsTotal)
		{
			dots = [];
			return;
		}

		if (ok)
		{
			dots.push([joyX, joyY]);
			$(".selection-result-" + dots.length).html(Math.floor(joyX / 40) + "" + Math.floor(joyY / 40));
			$(".selection-result-values span").removeClass('active');
		}
	}
	laststate = joystick.buttons[0].pressed;

	// if pressed, freeze the lines
	if (laststate) return;

	// clear
	context.fillStyle = "black";
	context.fillRect(0, 0, 400, 400);
	context.lineWidth = 2;

	// draw the background
	context.strokeStyle = "#0099ff";
	for (var i = 0; i < 400; i += 40)
	{
		for (var j = 0; j < 400; j += 40)
		{
		 	context.strokeRect(i,j,40,40);
		}
	}

	// draw elements
	for (d in dots)
	{
		context.fillStyle = "#4db8ff";
		context.fillRect(Math.floor(dots[d][0] / 40) * 40, Math.floor(dots[d][1] / 40) * 40, 40, 40);
	}

	// we are at the last item, verify result
	if (dots.length == dotsTotal)
	{
		$(".selection-result-status").show();
		$(".selection-result-status .attempt").show();
		return;
	}

	// fill ok hover items
	if (ok)
	{
		context.fillStyle = "#ffe3cc";
		context.fillRect(Math.floor(joyX / 40) * 40, Math.floor(joyY / 40) * 40, 40, 40);
	}

	context.beginPath();
	context.arc(joyX, joyY, 10, 0, 2 * Math.PI, false);
	context.fillStyle = '#ff9d4d';
	context.fill();
	context.strokeStyle = '#f9f09f';
	context.stroke();

	context.fillStyle = "#f4e557";
	context.fillRect(joyX - 2, 0, 5, 400);
	context.fillRect(0, joyY - 2, 400, 5);
	context.fillStyle = "#ff9d4d";
	context.fillRect(joyX - 0, 0, 1, 400);
	context.fillRect(0, joyY - 0, 400, 1);

	// set the unlocked number
	$(".selection-result-" + (dots.length + 1)).html(Math.floor(joyX / 40) + "" + Math.floor(joyY / 40));
	$(".selection-result-values span").removeClass('active');
	$(".selection-result-" + (dots.length + 1)).addClass('active');
}

///////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////

// run on startup
$(function() {
	init();
});