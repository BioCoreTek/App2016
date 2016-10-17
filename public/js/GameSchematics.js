
function GameSchematics()
{
	// static
	this.context;
};

GameSchematics.prototype.init = function()
{
	var self = this;

	debug.debug('GameSchematics init');

	var c = $('.content canvas')[0];
	this.context = c.getContext('2d');

	this.drawSchematics();
};

GameSchematics.prototype.drawSchematics = function()
{
	debug.log('GameSchematics drawSchematics');

	// clear
	this.context.fillStyle = "#eee";
	this.context.fillRect(0, 0, 700, 400);
	this.context.lineWidth = 2;

	// global settings
	this.context.font="16px monospace";
	this.context.fillStyle = "#0099ff";
	this.context.strokeStyle = "#0099ff";

	// room
	this.context.strokeRect(50, 50, 600, 300);

	// entrance
	this.context.strokeRect(50, 350, 120, 10);
	this.context.fillText("Entrance", 50, 380);

	// table
	this.context.beginPath();
	this.context.ellipse(350, 200, 150, 75, 0, 0, 2 * Math.PI);
	this.context.stroke();

	// ai
	this.context.strokeRect(325, 175, 50, 50);
	this.context.fillText("Core", 330, 193);
	this.context.font='20px FontAwesome';
	this.context.fillText("\uf29a", 340, 218);
	this.context.font="16px monospace";

	// communication
	this.context.beginPath();
	this.context.moveTo(550, 50);
	this.context.lineTo(550, 100);
	this.context.lineTo(600, 150);
	this.context.lineTo(650, 150);
	this.context.stroke();
	this.context.fillText("External", 565, 80);
	this.context.fillText("Hatch", 580, 100);
	this.context.font='20px FontAwesome';
	this.context.fillText("\uf1eb", 595, 125);
	this.context.font="16px monospace";

	// incinerator
	this.context.beginPath();
	this.context.arc(625, 325, 20, 0, 2 * Math.PI, false);
	this.context.stroke();
	this.context.font='20px FontAwesome';
	this.context.fillText("\uf06d", 618, 330);
	this.context.font="16px monospace";

	// fridge
	this.context.strokeRect(605, 255, 40, 40);
	this.context.font='20px FontAwesome';
	this.context.fillText("\uf071", 615, 282);
	this.context.font="16px monospace";

	// board
	this.context.strokeRect(640, 155, 10, 90);

	// desk
	this.context.beginPath();
	this.context.moveTo(150, 50);
	this.context.lineTo(150, 100);
	this.context.lineTo(100, 150);
	this.context.lineTo(100, 200);
	this.context.lineTo(100, 275);
	this.context.lineTo(50, 275);
	this.context.stroke();

	// life support
	this.context.fillText("Life", 75, 90);
	this.context.fillText("Support", 60, 110);
	this.context.beginPath();
	this.context.arc(60, 60, 5, 0, 2 * Math.PI, false);
	this.context.stroke();
	this.context.beginPath();
	this.context.arc(60, 75, 5, 0, 2 * Math.PI, false);
	this.context.stroke();
	this.context.beginPath();
	this.context.arc(75, 60, 5, 0, 2 * Math.PI, false);
	this.context.stroke();
	this.context.beginPath();
	this.context.arc(100, 60, 5, 0, 2 * Math.PI, false);
	this.context.stroke();
	this.context.beginPath();
	this.context.arc(115, 60, 5, 0, 2 * Math.PI, false);
	this.context.stroke();
	this.context.beginPath();
	this.context.arc(130, 60, 5, 0, 2 * Math.PI, false);
	this.context.stroke();
	this.context.font='20px FontAwesome';
	this.context.fillText("\uf1cd", 123, 93);
	this.context.font="16px monospace";

	// console
	this.context.strokeRect(50, 155, 10, 90);
	this.context.strokeRect(70, 185, 15, 15);
	this.context.beginPath();
	this.context.arc(78, 192, 3, 0, 2 * Math.PI, false);
	this.context.stroke();
	this.context.fillText("Console", 105, 200);

	// shields
	this.context.strokeRect(330, 50, 80, 50);
	this.context.fillText("Shields", 335, 68);
	this.context.font='20px FontAwesome';
	this.context.fillText("\uf132", 362, 90);
	this.context.font="16px monospace";
};
