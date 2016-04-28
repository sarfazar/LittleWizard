LittleWizard.StartMenu = function(game) {
    this.startBG;
    this.startPrompt;
    this.ding;
}

LittleWizard.StartMenu.prototype = {
	
	create: function () {
        this.ding = this.add.audio('select_audio');
		startBG = this.add.image(0, 0, 'titlescreen');
		startBG.inputEnabled = true; 
        /*start the game when the screen/image is clicked*/
        startBG.events.onInputDown.addOnce(this.startGame, this);
        /*Adding text, positioned by X and Y, eightbitwonder bitmap image (font) and then the text itself, finally the size of the font*/
		startPrompt = this.add.bitmapText(this.world.centerX-155, this.world.centerY+180, 'eightbitwonder', 'Touch to Start!', 24);
	},

	startGame: function (pointer) {
        this.ding.play();
		this.state.start('Game');
	}
};