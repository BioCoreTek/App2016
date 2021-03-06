////////////////////////////// CONFIG /////////////////////////////////////////

function Config()
{
	// url to backend server
	this.server = 'http://10.25.6.94:3000';

	// each person will need to set this based on computer
	this.voiceIndex = 25;

	if ('ps' == CONTROLLER)
	{
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
		this.resetButtonIndex = 4;

		this.voiceIndex = 65;
	}
	else	// joystick
	{
		// which joystick buttons index mapped to which section
		this.buttonMap = {
			5: "lifesupport",
			6: "communications",
			7: "shields",
			8: "schematics"
		};
		// the button index for the trigger in axis-based tasks
		this.triggerButtonIndex = 0;
		// the button index to reset joystick tasks
		this.resetButtonIndex = 13;
	}

	// length of times of specific events in milliseconds
	this.eventTimes = {
		// time to blink success or failure afer submitting task result
		"GlobalTaskResult": 2500,

		"GlobalAppLoad": 1500,
		"GlobalLaunchAI": 1000,

		"TaskAigoodDiagnostic": 12000,
		"TaskSchematicsRendering": 2000,
		"TaskCommunicationsTransmissionVideo": 34000,
		"TaskCommunicationsTransmissionState1": 0,
		"TaskCommunicationsTransmissionState2": 2000,
		"TaskCommunicationsTransmissionState3": 3000,
		"TaskCommunicationsTransmissionState4": 1000,
		"TaskAigoodDonttakeme": 10000,
		"TaskAigoodIncinerator": 11000,
		"TaskAibadHelpcore": 11000,
		// total 1 minute 60000
		"TaskShieldsManualElement0": 0,
		"TaskShieldsManualElement1": 12000,
		"TaskShieldsManualElement2": 24000,
		"TaskShieldsManualElement3": 40000,
		"TaskShieldsManualElement4": 60000

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
		"TaskAigoodIncinerator": 500,
		"TaskAibadHelpcore": 500,
		// total 15000
		"TaskShieldsManualElement0": 0,
		"TaskShieldsManualElement1": 3000,
		"TaskShieldsManualElement2": 6000,
		"TaskShieldsManualElement3": 10000,
		"TaskShieldsManualElement4": 15000

	}
	}
};

Config.prototype.get = function(item)
{
	return this[item];
};