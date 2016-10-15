
function GameLifesupport()
{
	// static
	this.context;
	this.dotsTotal = 4;
	this.buttonIndex = config.get('triggerButtonIndex');

	this.dots = [];
	this.lastState = 1;
};

GameLifesupport.prototype.init = function()
{
	var self = this;

	debug.debug('GameLifesupport init');

	var c = $('.content canvas')[0];
	this.context = c.getContext('2d');

	this.dots = [];
	this.lastState = 1;
	this.resetInterface();

	PubSub.subscribe('gamePadLoop', function(msg, data)
	{
		self.runFrame(data);
	});
};

GameLifesupport.prototype.runFrame = function(joystick)
{
	debug.log('GameLifesupport runFrame');

	// draw joystick lines
	var joyX = (joystick.axes[0] + 1.0) * 200;
	var joyY = (joystick.axes[1] + 1.0) * 200;

	var ok = false;
	var xl = Math.floor((joyX - 10) / 40);
	var xr = Math.floor((joyX + 10) / 40);
	var yl = Math.floor((joyY - 10) / 40);
	var yr = Math.floor((joyY + 10) / 40);

	if (yl*10+xl == yr*10+xr)
		ok = true;

	// handle dropping a dot - button release
	if (joystick.buttons[this.buttonIndex].pressed && joystick.buttons[this.buttonIndex].pressed != this.lastState)
	{
		// start over game
		if (this.dots.length == this.dotsTotal)
		{
			this.dots = [];
			return;
		}

		if (ok)
		{
			this.dots.push([joyX, joyY]);
			debug.debug('Adding dots', this.dots);
			$(".selection-result-" + this.dots.length - 1).html(Math.floor(joyX / 40) + "" + Math.floor(joyY / 40));
			$(".selection-result-values span").removeClass('active');
		}
	}
	// store the state of the button press
	this.lastState = joystick.buttons[this.buttonIndex].pressed;

	// if button pressed (and holding down), freeze the lines
	if (this.lastState)
		return;

	// clear
	this.context.fillStyle = "black";
	this.context.fillRect(0, 0, 400, 400);
	this.context.lineWidth = 2;

	// draw the background
	this.context.strokeStyle = "#0099ff";
	for (var i = 0; i < 400; i += 40)
	{
		for (var j = 0; j < 400; j += 40)
		{
			this.context.strokeRect(i,j,40,40);
		}
	}

	// draw elements
	for (d in this.dots)
	{
		this.context.fillStyle = "#4db8ff";
		this.context.fillRect(Math.floor(this.dots[d][0] / 40) * 40, Math.floor(this.dots[d][1] / 40) * 40, 40, 40);
	}

	// we are at the last item, verify result
	if (this.dots.length == this.dotsTotal)
	{
		$(".selection-result-status").show();
		$(".selection-result-status .attempt").show();
		return;
	}

	// fill ok hover items
	if (ok)
	{
		this.context.fillStyle = "#ffe3cc";
		this.context.fillRect(Math.floor(joyX / 40) * 40, Math.floor(joyY / 40) * 40, 40, 40);
	}

	this.context.beginPath();
	this.context.arc(joyX, joyY, 10, 0, 2 * Math.PI, false);
	this.context.fillStyle = '#ff9d4d';
	this.context.fill();
	this.context.strokeStyle = '#f9f09f';
	this.context.stroke();

	this.context.fillStyle = "#f4e557";
	this.context.fillRect(joyX - 2, 0, 5, 400);
	this.context.fillRect(0, joyY - 2, 400, 5);
	this.context.fillStyle = "#ff9d4d";
	this.context.fillRect(joyX - 0, 0, 1, 400);
	this.context.fillRect(0, joyY - 0, 400, 1);

	// set the unlocked number
	$(".selection-result-" + (this.dots.length)).html(Math.floor(joyX / 40) + "" + Math.floor(joyY / 40));
	$(".selection-result-values span").removeClass('active');
	$(".selection-result-" + (this.dots.length)).addClass('active');
};


GameLifesupport.prototype.resetInterface = function()
{
	for (var i = 0; i < this.dotsTotal; i++)
		$(".selection-result-" + i).html("&nbsp;&nbsp;");
	$(".selection-result-values span").removeClass('active');
	$(".selection-result-status").hide();
	$(".selection-result-status p").hide();
};
