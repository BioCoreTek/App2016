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

	stateManager = new StateManager();
	stateManager.init();

	statsChart = new StatsChart();
	statsChart.init();

	section = new Sections();
	section.init();

	gamePad = new GamePad();
	gamePad.init(config.get('buttonMap'));

	notifications = new Notifications();
	//notifications.init();


	// run the app now
	stateManager.goToGroup("lifesupport");
}



///////////////////////////////////////////////////////////////////////////////
    //---------------------------------------- 
    // OXYGEN

    var surface;
    var context;
    var dots = [];
    var laststate = 1;
    function OxygenMain(context, joystick)
    {
      var out = "";

      // draw joystick lines
      var joyX = (joystick.axes[0] + 1.0) * 200;
      var joyY = (joystick.axes[1] + 1.0) * 200;
debug.debug(joystick.axes[0]);
      var ok = false;
      var xl = Math.floor((joyX - 10) / 40);
      var xr = Math.floor((joyX + 10) / 40);
      var yl = Math.floor((joyY - 10) / 40);
      var yr = Math.floor((joyY + 10) / 40);
      if (yl*10+xl == yr*10+xr) ok = true;

      // handle dropping a dot
      if (joystick.buttons[0].pressed && joystick.buttons[0].pressed != laststate)
      {
        if (dots.length == 3) {
          dots = [];
          return;
        }

        if (ok)
        {
          dots.push([joyX, joyY]);
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
        context.fillStyle = "rgb(0,180,0)";
        context.fillRect(Math.floor(dots[d][0] / 40) * 40, Math.floor(dots[d][1] / 40) * 40, 40, 40);
        context.beginPath();
        context.arc(dots[d][0], dots[d][1], 10, 0, 2 * Math.PI, false);
        context.fillStyle = 'blue';
        context.fill();
        context.strokeStyle = '#bb4458';
        context.stroke();

        out += Math.floor(dots[d][0] / 40) + "" + Math.floor(dots[d][1] / 40) + " ";
      }

      if (dots.length == 3) return;

      if (ok)
      {
        context.fillStyle = "#ccebff";
        context.fillRect(Math.floor(joyX / 40) * 40, Math.floor(joyY / 40) * 40, 40, 40);
      }

      context.beginPath();
      context.arc(joyX, joyY, 10, 0, 2 * Math.PI, false);
      context.fillStyle = '#0099ff';
      context.fill();
      context.strokeStyle = '#bb4458';
      context.stroke();

      context.fillStyle = "#f0d90f";
      context.fillRect(joyX - 2, 0, 5, 400);
      context.fillRect(0, joyY - 2, 400, 5);
      context.fillStyle = "#f4e557";
      context.fillRect(joyX - 0, 0, 1, 400);
      context.fillRect(0, joyY - 0, 400, 1);
/*
      // do the output
      if (dots.length < 3) out += Math.floor(joyX / 40) + "" + Math.floor(joyY / 40) + " ";
      if (dots.length < 1) out += "-- ";
      if (dots.length < 2) out += "-- ";
      document.getElementById("output").innerText = out;
*/

    }

///////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////

// run on startup
$(function() {
	init();
});