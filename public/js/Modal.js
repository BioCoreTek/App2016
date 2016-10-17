///////////////////////////// SECTIONS ////////////////////////////////////////

function Modal()
{
	this.modalEl = $(".modal");
	this.currentGroupName = null;
	this.currentStateName = null;
	this.supportedGroups = ["ai"];
};

Modal.prototype.init = function()
{
	var self = this;

	this.modalEl.on('show.bs.modal', function (event)
	{
		self.setTemplate();
	});

	// listen for state changes to display a modal
	PubSub.subscribe('state', function(msg, data)
	{
		debug.debug('Modal PubSub sub state', msg, data);
		if (self.isSupportedGroup(data.group))
		{
			self.setSate(data.group, data.state);
			self.modalEl.modal('show');
			if (data.gameObj)
			{
				debug.debug('Modal calling gameObj init');
				data.gameObj.init();
			}
		}
		else
		{
			debug.debug('Modal PubSub sub state ignoring unsupported state', msg, data);
		}
	});
};

Modal.prototype.isSupportedGroup = function(group)
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

Modal.prototype.setSate = function(group, state)
{
	debug.debug('Modal setSate called for:', group);

	this.currentGroupName = group;
	this.currentStateName = state;

	return true;
};

/**
 * @ngdoc method
 * @name setTemplate
 * @methodOf Modal
 * @description
 * Display the state's template in the modal working space
 */
Modal.prototype.setTemplate = function()
{
	debug.debug('Modal setTemplate called for:', this.currentGroupName, this.currentStateName);

	// build template name with group and state
	var tname = this.currentGroupName + '-' + this.currentStateName;
	var t = $("#template-" + tname).children().clone();

	this.modalEl.find('.modal-body').html('');
	this.modalEl.find('.modal-body').append(t);
};