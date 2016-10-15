
/////////////////////////// NOTIFICATIONS /////////////////////////////////////

function Notifications()
{
	this.chartObj;
};

Notifications.prototype.init = function()
{
	var self = this;

	// turn on the first notification for each section
	$(".sidebar .notifications .note-group .note").hide();
	$(".sidebar .notifications .note-group .note:first-child").show();

	// listen for state changes to display a template
	PubSub.subscribe('state', function(msg, data)
	{
		debug.debug('Notifications PubSub sub state', msg, data);
		self.changeStatus(data.group, data.state);
	});
}

/**
 * @describe
 * Change which notification is shown
 */
Notifications.prototype.changeStatus = function(group, state)
{
	// hide all notes of for the group
	$(".sidebar .notifications #note-" + group + ' .note').hide();
	// show the specific note for the state
	$(".sidebar .notifications #note-" + group + '-' + state).show();
};
