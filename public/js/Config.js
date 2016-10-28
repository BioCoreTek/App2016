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
	// the button index for the trigger in axis-based tasks
	this.triggerButtonIndex = 5;
	// the button index to reset joystick tasks
	this.resetButtonIndex = 6;

	// length of times of specific events in milliseconds
	this.eventTimes = {
		// time to blink success or failure afer submitting task result
		"GlobalTaskResult": 2500,

		"GlobalAppLoad": 1500,
		"GlobalLaunchAI": 1000,

		"TaskAigoodDiagnostic": 5000,
		"TaskSchematicsRendering": 2000,
		"TaskCommunicationsTransmissionVideo": 3000,
		"TaskCommunicationsTransmissionState1": 0,
		"TaskCommunicationsTransmissionState2": 2000,
		"TaskCommunicationsTransmissionState3": 3000,
		"TaskCommunicationsTransmissionState4": 1000,
		"TaskAigoodDonttakeme": 3000,
		"TaskAibadHelpcore": 3000,

	}

	// set really short times for events for development
	if (DEV)
	{
	this.eventTimes = {
		// time to blink success or failure afer submitting task result
		"GlobalTaskResult": 500,

		"GlobalAppLoad": 500,
		"GlobalLaunchAI": 500,

		"TaskAigoodDiagnostic": 500,
		"TaskSchematicsRendering": 500,
		"TaskCommunicationsTransmissionVideo": 500,
		"TaskCommunicationsTransmissionState1": 500,
		"TaskCommunicationsTransmissionState2": 500,
		"TaskCommunicationsTransmissionState3": 500,
		"TaskCommunicationsTransmissionState4": 500,
		"TaskAigoodDonttakeme": 500,
		"TaskAibadHelpcore": 500,

	}
	}
};

Config.prototype.get = function(item)
{
	return this[item];
};