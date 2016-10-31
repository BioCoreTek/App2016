
function TaskShieldsManual()
{
	this.taskName = 'TaskShieldsManual';
	this.ipadTaskName = 'TaskIpadshieldsManual';

	// the state of the button press from ipad
	// release or press
	this.resultCheck = 'release';

	this.domMeterBar;
	this.domMeterVal;

	// meterMin - meterMax
	this.meterValue;

	this.meterMin = 6;
	this.meterMax = 97;

	this.meterInt;

	this.analysisDone = false;
	this.analysisStartTime;

	this.elemSolution = ['H', 'C', 'K', 'Fe'];

	this.domElement1;
	this.domElement2;
	this.domElement3;
	this.domElement4;

	this.elemList = [
		"H",
		"He",
		"Li",
		"Be",
		"B",
		"C",
		"N",
		"O",
		"F",
		"Ne",
		"Na",
		"Mg",
		"Al",
		"Si",
		"P",
		"S",
		"Cl",
		"Ar",
		"K",
		"Ca",
		"Sc",
		"Ti",
		"V",
		"Cr",
		"Mn",
		"Fe",
		"Co",
		"Ni",
		"Cu",
		"Zn",
		"Ga",
		"Ge",
		"As",
		"Se",
		"Br",
		"Kr",
		"Rb",
		"Sr",
		"Y",
		"Zr",
		"Nb",
		"Mo",
		"Tc",
		"Ru",
		"Rh",
		"Pd",
		"Ag",
		"Cd",
		"In",
		"Sn",
		"Sb",
		"Te",
		"I",
		"Xe",
		"Cs",
		"Ba",
		"La",
		"Ce",
		"Pr",
		"Nd",
		"Pm",
		"Sm",
		"Eu",
		"Gd",
		"Tb",
		"Dy",
		"Ho",
		"Er",
		"Tm",
		"Yb",
		"Lu",
		"Hf",
		"Ta",
		"W",
		"Re",
		"Os",
		"Ir",
		"Pt",
		"Au",
		"Hg",
		"Tl",
		"Pb",
		"Bi",
		"Po",
		"At",
		"Rn",
		"Fr",
		"Ra",
		"Ac",
		"Th",
		"Pa",
		"U",
		"Np",
		"Pu",
		"Am",
		"Cm",
		"Bk",
		"Cf",
		"Es",
		"Fm",
		"Md",
		"No",
		"Lr",
		"Rf",
		"Db",
		"Sg",
		"Bh",
		"Hs",
		"Mt",
		"Ds",
		"Rg",
		"Cn",
		"Uut",
		"Fl",
		"Uup",
		"Lv",
		"Uus",
		"Uuo"
	];

	this.pubSubs = [];

	this.timeLengthGlobalTaskResult = config.get('eventTimes')['GlobalTaskResult'];
};

TaskShieldsManual.prototype.init = function()
{
	var self = this;

	this.startTask();

	this.domMeterBar = $(".section-shields-manual .radiation-level");
	this.domMeterVal = $(".section-shields-manual .radiation-percent");

	this.domElement1 = $(".radiation-composition-element1");
	this.domElement2 = $(".radiation-composition-element2");
	this.domElement3 = $(".radiation-composition-element3");
	this.domElement4 = $(".radiation-composition-element4");

	PubSub.publish('audio', {name: 'alarm', action: 'play', loop: true});

	this.pubSubs.push(
		PubSub.subscribe('task', function(msg, data)
		{
			debug.debug('TaskShieldsManual PubSub sub task', msg, data);
			if (data && data.taskname == self.taskName)
			{
				if (data.command == 'result')
					self.processResults(data.result);
			}
			debug.debug('TaskShieldsManual PubSub sub task', data.command, data.taskname, self.ipadTaskName);
			if (data && data.taskname == self.ipadTaskName)
			{
				if (data.command == 'check')
					self.processCheck(data.result);
			}
		})
	);

	// turn off fake fluxtuation in statsChart
	PubSub.publish('stats', {event: 'fluxtuations', command: 'stop', name: 'Radiation'});
	this.meterValue = this.meterMin;
	this.runMeter();
};

// to be called when game exists
TaskShieldsManual.prototype.exit = function()
{
	this.resetAnalysis();
	clearInterval(this.meterInt);
	PubSub.publish('audio', {name: 'alarm', action: 'stop'});
	PubSub.publish('stats', {event: 'fluxtuations', command: 'start', name: 'Radiation'});
};

TaskShieldsManual.prototype.startTask = function()
{
	debug.log('TaskShieldsManual startTask');

	// start task
	PubSub.publish('server', {
		event: 'task',
		command: 'start',
		data: {
			taskname: this.taskName
		}
	});
};

TaskShieldsManual.prototype.stopTask = function()
{
	debug.log('TaskShieldsManual stopTask');

	// stop task
	PubSub.publish('server', {
		event: 'task',
		command: 'stop',
		data: {
			taskname: this.taskName
		}
	});
};

TaskShieldsManual.prototype.processCheck = function(result)
{
	debug.debug('TaskShieldsManual processCheck:', result);
	if ("press" == result)
	{
		this.resultCheck = 'press';
		$(".section-shields-manual .control-panel i").addClass('pressed');
		this.runAnalysis();
	}
	else // release
	{
		this.resultCheck = 'release';
		$(".section-shields-manual .control-panel i").removeClass('pressed');
		this.resetAnalysis();
	}
};

TaskShieldsManual.prototype.processResults = function(result)
{
	var self = this;

	debug.debug('TaskShieldsManual processResults:', result);
	if (result)
	{
		setTimeout(function(){
			self.stopTask();
			PubSub.publish('stateNext', {group: 'shields'});
			PubSub.publish('goToGroup', {group: 'shields'});
		}, this.timeLengthGlobalTaskResult);
	}
};

TaskShieldsManual.prototype.runMeter = function()
{
	var self = this;

	this.meterInt = setInterval(function() {
		if (self.resultCheck == 'press' && self.meterValue > self.meterMin)
			self.meterValue--;
		if (self.resultCheck == 'release' && self.meterValue < self.meterMax)
			self.meterValue++;
		debug.log('TaskShieldsManual runMeter meterValue', self.meterValue, self.domMeterBar);
		self.domMeterBar.width(self.meterValue+'%');
		self.domMeterVal.html(self.meterValue+'%');
		PubSub.publish('stats', {event: 'fluxtuations', command: 'set', name: 'Radiation', value: self.meterValue});
	}, 500);
};

TaskShieldsManual.prototype.runAnalysis = function()
{
	debug.debug('TaskShieldsManual runAnalysis');
	this.stepAnalysis();
};

TaskShieldsManual.prototype.resetAnalysis = function()
{
	$(".section-shields-manual .radiation-composition-element").html('');
	$(".section-shields-manual .radiation-composition-element").css('visibility', 'hidden');
	this.analysisStartTime = 0;
	this.analysisDone = false;
};

TaskShieldsManual.prototype.stepAnalysis = function(timestamp)
{
	var self = this;

	debug.debug('TaskShieldsManual stepAnalysis', timestamp);
	if(timestamp)
	{
		if (!this.analysisStartTime)
			this.analysisStartTime = timestamp;
		var progress = timestamp - this.analysisStartTime;
		debug.debug('TaskShieldsManual stepAnalysis progress', progress);

		for (var i = 0; i < 4; i++)
		{
			// draw a fake value spinning
			if (progress > config.get('eventTimes')['TaskShieldsManualElement' + i]
			&& progress < config.get('eventTimes')['TaskShieldsManualElement' + (i + 1)])
			{
				$(".section-shields-manual .radiation-composition-element" + (i + 1)).css('visibility', 'visible');

				//process the cells...
				//tricky modulo for only odd progress times... (slows down the rendering...
				if (progress & 5)
				{
					//random value in the cell...
					$(".section-shields-manual .radiation-composition-element" + (i + 1)).html(self.elemList[Math.floor(Math.random()*self.elemList.length)]);
				}
			}
			// draw the real value
			if (progress > config.get('eventTimes')['TaskShieldsManualElement' + (i + 1)])
			{
				$(".section-shields-manual .radiation-composition-element" + (i + 1)).html(this.elemSolution[i]);
				// we are done, stop animation
				if (i == 3)
					self.analysisDone = true;
			}
		}
	}
	if (this.resultCheck == 'press' && !this.analysisDone)
	{
		window.requestAnimationFrame(function(timestamp) {
			self.stepAnalysis(timestamp)
		});
	}
};