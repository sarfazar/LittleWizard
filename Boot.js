var LittleWizard = {};

LittleWizard.Boot = function (game) {};

LittleWizard.Boot.prototype = {
    /*Preloads before creation, loading assets*/
    preload: function () {
        this.load.image('preloaderBar', 'images/loader_new.png');
        this.load.image('titleimage', 'images/TitleImage.png');
        this.load.bitmapFont('eightbitwonder', 'fonts/eightbitwonder.png', 'fonts/eightbitwonder.fnt');
    },
    
    create: function () {
        /*Number of pointers/fingers on screen*/
        this.input.maxPointers = 1;
        /*Tabbing out will pause the game (on false)*/
		this.stage.disableVisibilityChange = false;
        /*This means nothing will be cut off if they are sized strangely*/
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        /*Minimum width and height in browsers*/
		this.scale.minWidth = 270;
		this.scale.minHeight = 480;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
        /*Forces the phone to be in portrait mode*/
		this.stage.forcePortrait = true;
        /*Forces the screen size of the game*/
		this.scale.setScreenSize(true);
        /*Setting the input as this pointer*/
		this.input.addPointer();
		this.stage.backgroundColor = '#8AE5E5';
        /*Launching the preloader when the Boot has finished*/
        this.state.start('Preloader');
    }
}