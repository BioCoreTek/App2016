////////////////////////////// CHARTS /////////////////////////////////////////

function StatsChart()
{
	this.chartObj;
	this.chartEl;
	this.dataItemLabels = ["Oxygen", "Radiation", "Power", "Gravity"];
	this.dataItemLabelsLen = this.dataItemLabels.length;
	this.dataInitital = [92, 3, 67, 80];
	this.fluxValues = [];

	// keyed by index
	this.fluxEnabled = [true, true, true, true];

	// ranges for random fluxtuations
	this.fluxDataRanges = [];
	this.fluxDataRanges[0] = [86, 100];
	this.fluxDataRanges[1] = [1, 6];
	this.fluxDataRanges[2] = [42, 81];
	this.fluxDataRanges[3] = [76, 97];
};

StatsChart.prototype.init = function()
{
	var self = this;
	this.chartEl = $("#statsChart");
	this.chartObj = new Chart(this.chartEl, {
		type: 'bar',
		data: {
			labels: this.dataItemLabels,
			datasets: [{
				data: this.dataInitital,
				backgroundColor: [
					'#4db8ff',
					'#ff9d4d',
					'#7dc0cf',
					'#f4e557'
				],
				hoverBackgroundColor: [
					'#0099ff',
					'#ff7300',
					'#44a5bb',
					'#f0d90f'
				],
				borderWidth: 0
			}]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true,
						min: 0,
						max: 100,
						stepSize: 10,
						fontColor: 'rgba(255, 255, 255, 0.7)',
						fontSize: '11'
					},
					gridLines: {
						color: 'rgba(255, 255, 255, 0.4)',
						zeroLineColor: 'rgba(255, 255, 255, 0.4)'
					}
				}],
				xAxes: [{
					ticks: {
						fontColor: 'rgba(255, 255, 255, 0.7)',
						fontSize: '16'
					}
				}]
			},
			maintainAspectRatio: false,
			legend: {
				display: false
			},
			tooltips: {
				enabled: false
			}
		}
	});
	$( window ).resize(function() {
		self.resizeChart();
	});
	this.fakeFluxtuations();

	PubSub.subscribe('stats', function(msg, data)
	{
		debug.debug('statsChart PubSub sub state', msg, data);
		if (data.event == 'fluxtuations')
		{
			if (data.command == 'start')
				self.setFluxStatus(data.name, true);
			else if (data.command == 'stop')
				self.setFluxStatus(data.name, false);
			else if (data.command = 'set')
				self.setFluxValue(data.name, data.value);
		}
	});
};

StatsChart.prototype.resizeChart = function()
{
	this.chartObj.resize();
};

StatsChart.prototype.setChartData = function(itemIndex, value, noUpdate)
{
	this.chartObj.data.datasets[0].data[itemIndex] = value;
	if (!noUpdate)
		this.chartObj.update();
};

StatsChart.prototype.getChartItemIndexByLabel = function(itemLabel)
{
	for (var i = 0; i < this.dataItemLabelsLen; i++)
	{
		if (this.dataItemLabels[i] == itemLabel)
			return i;
	}
	return null;
};
/*
// run all fluxtuations at once
StatsChart.prototype.fakeFluxtuations = function()
{
	var self = this;
	var t = Math.floor(Math.random() * (4000 - 800)) + 800;
	setTimeout(function() {
		for (var i = 0; i < self.dataItemLabelsLen; i++)
		{
			if (self.fluxEnabled[i])
			{
				var newVal = self.getFakeFluxValue(i);
				self.setChartData(i, newVal, true);
			}
		}
		self.chartObj.update();
		self.fakeFluxtuations();
	}, t);
};
*/
// run each fluxtuation individually
StatsChart.prototype.fakeFluxtuations = function()
{
	for (var i = 0; i < this.dataItemLabelsLen; i++)
	{
		this.fakeFluxItem(i);
	}
};

StatsChart.prototype.fakeFluxItem = function(itemIndex)
{
	var self = this;
	var t = Math.floor(Math.random() * (4000 - 800)) + 800;
	setTimeout(function() {
		if (self.fluxEnabled[itemIndex])
		{
			var newVal = self.getFakeFluxValue(itemIndex);
			self.fluxValues[itemIndex] = newVal;
			self.setChartData(itemIndex, newVal, true);
		}
		self.chartObj.update();
		self.fakeFluxItem(itemIndex);
	}, t);
};

StatsChart.prototype.getFakeFluxValue = function(itemIndex)
{
	// get a random direction, 0 = down, 1 = up;
	var d = Math.floor(Math.random() * (2 - 0)) + 0;
	// get a random change value
	var c = Math.floor(Math.random() * (5 - 1)) + 1;
	var dif = (d) ? c : -c;
	// out of range? reverse direction of random 
	if (this.chartObj.data.datasets[0].data[itemIndex] + dif < this.fluxDataRanges[itemIndex][0]
		|| this.chartObj.data.datasets[0].data[itemIndex] + dif > this.fluxDataRanges[itemIndex][1])
		dif = -c;
	// still out of range? leave value as-is for now, try again next round
	if (this.chartObj.data.datasets[0].data[itemIndex] + dif < this.fluxDataRanges[itemIndex][0]
		|| this.chartObj.data.datasets[0].data[itemIndex] + dif > this.fluxDataRanges[itemIndex][1])
		dif = 0;
	return this.chartObj.data.datasets[0].data[itemIndex] + dif;
};

StatsChart.prototype.setFluxStatus = function(name, enable)
{
	for (var i = 0, len = this.dataItemLabels.length; i < len; i++)
	{
		if (name == this.dataItemLabels[i])
		{
			this.fluxEnabled[i] = enable;
		}
	}
};

StatsChart.prototype.setFluxValue = function(name, value)
{
	for (var i = 0, len = this.dataItemLabels.length; i < len; i++)
	{
		if (name == this.dataItemLabels[i])
		{
			this.fluxValues[i] = value;
			this.setChartData(i, value, true);
			this.chartObj.update();
		}
	}
};
