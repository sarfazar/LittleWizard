LittleWizard.Preloader = function(game) {
    /*Initialising variables*/
    this.preloadBar = null;
    this.titleText = null;
    this.ready = false;
};

LittleWizard.Preloader.prototype = {
	
	preload: function () {
        /*Sprite allows the preload bar to "expand"*/
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);
		this.load.setPreloadSprite(this.preloadBar);
		this.titleText = this.add.bitmapText(this.world.centerX-234, this.world.centerY-220, 'eightbitwonder', 'Little Wizard', 40);
        this.load.image('titlescreen', 'images/TitleBG.png');
        /*Loading in the font*/
        this.load.bitmapFont('eightbitwonder', 'fonts/eightbitwonder.png', 'fonts/eightbitwonder.fnt');
        /*Loading the images*/
        this.load.image('hill', 'images/SimpleHill.png');
        this.load.image('sky', 'images/SkyClouds.png');
        this.load.atlasXML('House', 'images/spritesheets/Houses.png', 'images/spritesheets/Houses.xml');
        this.load.atlasXML('spacerock', 'images/spritesheets/SpaceRock.png', 'images/spritesheets/SpaceRock.xml');
        this.load.atlasXML('meteor', 'images/spritesheets/Meteors.png', 'images/spritesheets/Meteors.xml');
        this.load.atlasXML('fireball', 'images/spritesheets/Fball.png', 'images/spritesheets/Fball.xml');
        this.load.atlasXML('wizard', 'images/spritesheets/WizCast.png', 'images/spritesheets/WizCast.xml');
        /*Loading the Audio*/
        this.load.audio('explosion_audio', 'audio/Explosion.wav');
        this.load.audio('hurt_audio', 'audio/House_Hit.wav');
        this.load.audio('select_audio', 'audio/StartGame.wav');
        this.load.audio('game_audio', 'audio/Galavanting_Through_Low_Rez_Forests.mp3');
	},

    /*No longer crop the Load bar, as it has finished loading*/
	create: function () {
		this.preloadBar.cropEnabled = false;
	},

	update: function () {
        if(this.cache.isSoundDecoded('game_audio') && this.ready == false) {
            this.ready = true;
            /*Launches the next module*/
            this.state.start('StartMenu');
        }
	}
};