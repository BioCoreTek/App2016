///////////////////////////////////////////////////////////////////////////////
function setupDev()
{
	// fake events with buttons for now
	$(".admin-event-bar button").click(function(e) {
		var id = $(this).attr('id');
		// take off the prefix: admin-
		var a = id.substring(6);
		var parts = a.split("-");

		if ($(this).hasClass('state'))
		{
			// fake a server publish event
			PubSub.publish('stateSet', {
				group: parts[0],
				state: parts[1]
			});
			var interrupt = false;
			if ($(this).hasClass('interrupt'))
			{
				interrupt = true;
			}
			// fake a server publish event
			PubSub.publish('stateInterrupt', {
				group: parts[0]
			});
		}

		if ($(this).hasClass('timer'))
		{
			// fake a server publish timer
			PubSub.publish('timer', {
				event: parts[0]
			});

		}
	});
	$('.admin-event-bar').show();
}