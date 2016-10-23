///////////////////////////// SECTIONS ////////////////////////////////////////

function Sections()
{
	this.sectionEl = $("#section");
	this.currentGroupName = null;
	this.currentStateName = null;
	this.supportedGroups = ["lifesupport", "communications", "shields", "schematics", "ipadshields"];
};

Sections.prototype.init = function()
{
	var self = this;

	// setup section onclicks
	$("footer .nav li a").click(function(e)
	{
		var id = $(this).attr('id');
		// take off the prefix: link-
		var a = id.substring(5);
		PubSub.publish('section', a);
	});
/*
	// listen for state group changes to change sections button selection
	PubSub.subscribe('stategroup', function(msg, data)
	{
		debug.debug('Sections PubSub sub stategroup', msg, data);
		self.changeSection(data.group);
	});
*/
	// listen for state changes to display a section
	PubSub.subscribe('state', function(msg, data)
	{
		debug.debug('Sections PubSub sub state', msg, data);
		if (data.mode == 'section' && self.isSupportedGroup(data.group))
		{
			self.changeSection(data.group);
			self.setTemplate(data.group, data.state);
			if (data.gameObj)
			{
				debug.debug('Sections calling gameObj init');
				data.gameObj.init();
			}
		}
		else
		{
			debug.debug('Sections PubSub sub state ignoring unsupported state', msg, data);
		}
	});
};

Sections.prototype.isSupportedGroup = function(group)
{
	for (var i = 0, len = this.supportedGroups.length; i < len; i++)
	{
		if (group == this.supportedGroups[i])
		{
			return true;
		}
	}
	return false;
};

Sections.prototype.changeSection = function(group)
{
	debug.debug('Sections changeSection called for:', group);

	if (this.currentGroupName == group)
	{
		debug.debug('Sections changeSection already in group:', group);
		return false;
	}

	this.currentGroupName = group;

	// change selected button in footer
	$("footer .nav li").removeClass('active');
	$("footer .nav li#li-" + group).addClass('active');

	// change display title in top bar
	$(".topbar h1").hide();
	$(".topbar h1#topbar-" + group).show();
};

/**
 * @ngdoc method
 * @name setTemplate
 * @methodOf Sections
 * @description
 * Display the state's template in the application working space
 */
Sections.prototype.setTemplate = function(group, state)
{
	debug.debug('Sections setTemplate called for:', group, state);

	if (this.currentGroupName == group && this.currentStateName == state)
	{
		debug.debug('Sections setTemplate already in group and state:', group, state);
		return false;
	}
	this.currentStateName = state;

	// build template name with group and state
	var tname = group + '-' + state;
	var t = $("#template-" + tname).children().clone();

	// show the template in the working space
	this.sectionEl.html('');
	t.appendTo(this.sectionEl);

	// set a class name for the element for specific styles
	this.sectionEl.find('>div').addClass('section-'+ tname);
};
