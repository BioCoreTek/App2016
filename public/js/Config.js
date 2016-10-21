////////////////////////////// CONFIG /////////////////////////////////////////

function Config()
{
	// url to backend server
	this.server = 'http://localhost:3000';
	// which joystick buttons index mapped to which section
	this.buttonMap = {
		0: "lifesupport",
		1: "communications",
		2: "shields",
		3: "schematics"
	};
	// the button index for the trigger in axis-based game
	this.triggerButtonIndex = 5;
};

Config.prototype.get = function(item)
{
	return this[item];
};