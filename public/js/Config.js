////////////////////////////// CONFIG /////////////////////////////////////////

function Config()
{
	// which joystick buttons mapped to which section
	this.buttonMap = {
		0: "lifesupport",
		1: "communications",
		2: "shields",
		3: "schematics"
	};
};

Config.prototype.get = function(item)
{
	return this[item];
};