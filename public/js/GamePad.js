
////////////////////////////// GAMEPAD ////////////////////////////////////////

function GamePad()
{
	this.supported = false;
	this.enabled = false;
	this.buttonMap = {
		0: "lifesupport",
		1: "communications",
		2: "shields",
		3: "schematics"
	};
	this.sectionObj;
	this.gamePad
};

GamePad.prototype.init = function(sectionObj)
{
	var self = this;

	this.sectionObj = sectionObj;

	if (this.browserSupport())
	{
		this.supported = true;

		$(window).on("gamepadconnected", function()
		{
			debug.debug("connection event");
			self.enabled = true;
			self.gameLoop();
		});

		$(window).on("gamepaddisconnected", function()
		{
			debug.debug("disconnection event");
			self.enabled = false;
			self.checkGamePad();
		});

		this.checkGamePad();
	}
};

GamePad.prototype.browserSupport = function()
{
	return "getGamepads" in navigator;
};

GamePad.prototype.checkGamePad = function()
{
	var self = this;

	//setup an interval for Chrome
	var checkGP = window.setInterval(function()
	{
		if (navigator.getGamepads()[0])
		{
			debug.debug("check event success");
			if (!self.enabled)
				$(window).trigger("gamepadconnected");
			window.clearInterval(checkGP);
		}
	}, 500);
};

GamePad.prototype.gameLoop = function()
{
	var self = this;
	debug.log("game loop");
	if (self.gamepads = navigator.getGamepads())
	{
		debug.log("game loop gamepads");
		if (self.gamepad = self.gamepads[0])
		{
			debug.log("game loop gamepad");
			for (var i = 0, len = self.gamepad.buttons.length; i < len; i++)
			{
				debug.log("game loop button check:", i);
				if (self.gamepad.buttons[i].pressed)
				{
					debug.log("game loop button pressed:", i);
					if (typeof self.buttonMap[i] !== 'undefined')
					{
						debug.debug("game loop section:", i);
						self.sectionObj.goToSection(self.buttonMap[i]);
					}
				}
			}
		}
	}

	window.requestAnimationFrame(function() {
		self.gameLoop()
	});
};