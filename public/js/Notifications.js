
/////////////////////////// NOTIFICATIONS /////////////////////////////////////

function Notifications()
{
	this.chartObj;
};

// status: success | error
StatsChart.prototype.changeStatus = function(item, status)
{
	$(".sidebar .notifications #note-" + item).hide();
	$(".sidebar .notifications #note-" + item + '-' + status).show();
};
