LittleWizard.Game = function(game) {
    this.totalWizard;
    this.wizardgroup;
    this.fireballGroup;
    this.totalSpacerocks;
    this.spacerockgroup;
    this.totalHouses;
    this.totalPopulation;
    this.housegroup;
    this.burst;
    this.gameover;
    this.countdown;
    this.overmessage;
    this.secondsElapsed;
    this.timer;
    this.music;
    this.ouch;
    this.boom;
    this.ding;
};

LittleWizard.Game.prototype = {
    
    create: function() {
        this.gameover = false;
        this.secondsElapsed = 0;
        this.timer = this.time.create(false);
        this.timer.loop(1000, this.updateSeconds, this);
        this.totalWizard = 1;
        this.totalSpacerocks = 13;
        this.totalHouses = 2;
        this.music = this.add.audio('game_audio');
        this.music.play('', 0, 0.3, true);
        this.ouch = this.add.audio('hurt_audio');
        this.boom = this.add.audio('explosion_audio');
        this.ding = this.add.audio('select_audio');
        this.buildWorld();
    },
    
    updateSeconds: function() {
        this.secondsElapsed++;
    },
    
    /*Extra module for building the world*/
    buildWorld: function() {
        this.add.image(0, 0, 'sky');
        this.add.image(0, 800, 'hill');
        this.buildWizard();
        this.buildHouses();
        this.buildSpaceRocks();
        this.fireball();
        this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Population : ' + this.totalPopulation, 20);
        this.timer.start();
    },
    
    /*Add the Wizard*/
    buildWizard: function() {
        this.wizardgroup = this.add.group();
        var w = this.wizardgroup.create(this.world.width/2, this.world.height-180, 'wizard', 'wizard_01');
        var scale = 1.0;
        w.scale.x = scale;
        w.scale.y = scale;
        w.anchor.setTo(0.5, 0);
        w.animations.add('Cast',this.game.math.numberArray(19,24))
        w.animations.play('Cast', 5, true);
    },
    
    /*Add the Houses*/
    buildHouses: function() {
        this.housegroup = this.add.group();
        this.housegroup.enableBody = true;
        for (var i=0; i<this.totalHouses; i++) {
                var r = this.housegroup.create(100+(i*340), this.world.height-150, 'House', 'slice01');
                var scale = 1.0;
                r.scale.x = scale;
                r.scale.y = scale;
                r.anchor.setTo(0.5, 0.5);
                r.frame = 0;
                r.health = 5;
            }
        this.totalPopulation = this.totalHouses*4;
    },
    
    /*Add the Meteors*/
    buildSpaceRocks: function() {
        this.spacerockgroup = this.add.group();
        for(var i=0; i<this.totalSpacerocks; i++) {
            /*vary the size of the Meteors*/
            var scale = this.rnd.realInRange(1.0, 1.5);
            /*Spawn the meteors within the width but above the stage*/
            var r = this.spacerockgroup.create(this.rnd.integerInRange(0, this.world.width - (19* scale)), this.rnd.realInRange(-1500, 0), 'meteor', 'slice01');
            r.scale.x = scale;
            r.scale.y = scale;
            /*Allow phaser to apply physics*/
            this.physics.enable(r, Phaser.Physics.ARCADE);
            /*Allow the body to have collisions*/
            r.enableBody = true;
            /*Apply a "random" velocity*/
            r.body.velocity.y = this.rnd.integerInRange(200, 400);
            r.animations.add('Fall');
            /*Play the fall animation at 13 FPS*/
            r.animations.play('Fall', 13, true);
            r.checkWorldBounds = true;
            /*reset the Meteor when it falls off screen*/            
            r.events.onOutOfBounds.add(this.resetRock, this);
        }
    },
    
    resetRock: function(r) {
        if(r.y > this.world.height) {
            this.respawnRock(r);   
        }
    },
    
    /*Sets the bounds for where the Meteor respawns*/
    respawnRock: function(r) {
        if(this.gameover == false){
            r.reset(this.rnd.integerInRange(0, this.world.width ), this.rnd.realInRange(-1500, 0));
            r.body.velocity.y = this.rnd.integerInRange(200, 400);
        }
    },
    
    fireball:function() {
        this.fireballGroup = this.add.group();
        this.input.onDown.add(this.castFireball, this);
    },
    
    castFireball: function(pointer) {
        if(this.gameover == false){
            var f = this.fireballGroup.create(this.world.width/2, this.world.height-180, 'fireball', 'fireball_1.png');
            var scale = 2.0;
            f.scale.x = scale;
            f.scale.y = scale;
            f.anchor.setTo(0.5, 0.5);
            this.physics.enable(f, Phaser.Physics.ARCADE);
            f.enableBody = true;
            // move sprite "f" towards point x y (pointer click) at speed 500
            this.physics.arcade.moveToXY(f, pointer.x, pointer.y, 500);
            f.animations.add('fireball', this.game.math.numberArray(7,14));
            f.animations.add('fireballExploding', this.game.math.numberArray(0,6));
            f.animations.play('fireball', 25, true);
            f.checkWorldBounds = true;
            f.events.onOutOfBounds.add(this.killFireball, this);
        }
    },
    
    killFireball: function(f) {
            f.kill();  
    },
    
    /*Checks for a colision between a rock and a fireball*/
    fireballCollision: function(r, f) {
        f.body.velocity.x = 0;
        f.body.velocity.y = 0;
        f.animations.stop('fireball');
        f.animations.play('fireballExploding', 25, true);
        this.boom.play();
        this.boom.volume = 0.2;
        this.time.events.add(500, function() { this.killFireball(f); }, this);
        this.respawnRock(r);
    },
    
    /*Checks for a colision between a rock and a house*/
    houseCollision: function(r, h) {
        if(h.exists){
            if(h.health > 1)
            {
                this.respawnRock(r);
                h.damage(1);
                h.frame = 5-h.health;
                this.totalPopulation--;
                this.ouch.play();
                this.ouch.volume = 0.5;
                this.countdown.setText('Population : ' + this.totalPopulation);
                if(this.totalPopulation == 0)
                {
                    this.gameover = true;
                    this.music.stop();
                    this.overmessage = this.add.bitmapText(this.world.centerX-180, this.world.centerY-40, 'eightbitwonder', 'GAME OVER\n\n' + this.secondsElapsed, 42);
                    this.overmessage.align = "center";
                    this.overmessage.inputEnabled = true;
                    this.overmessage.events.onInputDown.addOnce(this.quitGame, this);
                }
            }
        }
    },
    
    quitGame:function(pointer) {
        this.ding.play();
        this.state.start('StartMenu');
    },
        
    update: function() {
        this.physics.arcade.overlap(this.spacerockgroup, this.fireballGroup, this.fireballCollision, null, this);
        this.physics.arcade.overlap(this.spacerockgroup, this.housegroup, this.houseCollision, null, this);
    }
};