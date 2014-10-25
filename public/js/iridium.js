/**
 * Created by Adam on 25/10/2014.
 */

var GameState = function(game) {
};

// Load images and sounds
GameState.prototype.preload = function() {
    this.game.load.image('player', '/assets/gfx/player.png');
    this.game.load.image('smoke', '/assets/gfx/smoke.png');
    this.game.load.image('ground', '/assets/gfx/ground.png');
    this.game.load.image('sky', '/assets/gfx/ground.png');
    this.game.load.spritesheet('explosion', '/assets/gfx/explosion.png', 128, 128);
    this.game.load.image('bullet', '/assets/gfx/bullet.png');
    this.game.load.image('background', '/assets/background.jpg');
};

// Setup the example
GameState.prototype.create = function() {
    game.world.setBounds(0, 0, 3264, 576);

    this.background = game.add.tileSprite(0, 0, game.world.bounds.width, game.world.bounds.height, 'background');

    // Create some ground for the player to walk on
    this.ground = this.game.add.group();
    for(var x = 0; x < this.game.width; x += 32) {
        // Add the ground blocks, enable physics on each, make them immovable
        var groundBlock = this.game.add.sprite(x, this.game.height - 32, 'ground');
        this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
        groundBlock.body.immovable = true;
        groundBlock.body.allowGravity = false;
        this.ground.add(groundBlock);
    }

    // Create some ground for the player to walk on
    this.sky = this.game.add.group();
    for(var x = 0; x < this.game.width; x += 32) {
        // Add the ground blocks, enable physics on each, make them immovable
        var skyBlock = this.game.add.sprite(x, 0, 'sky');
        this.game.physics.enable(skyBlock, Phaser.Physics.ARCADE);
        skyBlock.body.immovable = true;
        skyBlock.body.allowGravity = false;
        this.sky.add(skyBlock);
    }

    this.player = new Follower(this.game, this.game.width/2, this.game.height/2, this.game.input);

    // Create a follower
    this.game.add.existing(this.player);

    // Simulate a pointer click/tap input at the center of the stage
    // when the example begins running.
    this.game.input.x = this.game.width/2;
    this.game.input.y = this.game.height/2;

    // Create a group for explosions
    this.explosionGroup = this.game.add.group();

    this.NUMBER_OF_BULLETS = 1;
    this.BULLET_SPEED = 2000;
    this.SHOT_DELAY = 300;

    // Create an object pool of bullets
    this.bulletPool = this.game.add.group();

    for(var i = 0; i < 1000; i++) {
        // Create each bullet and add it to the group.
        var bullet = this.game.add.sprite(0, 0, 'bullet');
        this.bulletPool.add(bullet);

        // Set its pivot point to the center of the bullet
        bullet.anchor.setTo(0.5, 0.5);

        // Enable physics on the bullet
        this.game.physics.enable(bullet, Phaser.Physics.ARCADE);

        // Set its initial state to "dead".
        bullet.kill();
    }
};

// The update() method is called every frame
GameState.prototype.update = function() {
    // Shoot a bullet
    if (this.game.input.activePointer.isDown) {
        this.shootBullet();
    }

    // Collide the player with the ground
    this.game.physics.arcade.collide(this.player, this.ground);

    // Collide the player with the ground
    this.game.physics.arcade.collide(this.player, this.sky);

    this.background.tilePosition.x -= 1;

    // Set a variable that is true when the ship is touching the ground
//    var onTheGround = this.player.body.touching.down;

//    if (onTheGround) {
//        this.getExplosion(this.player.x, this.player.y);
//    }
//
//    // Set a variable that is true when the ship is touching the sky
//    var onTheSky = this.player.body.touching.up;
//
//    if (onTheSky) {
//        this.getExplosion(this.player.x, this.player.y);
//    }
};

// Follower constructor
var Follower = function(game, x, y, target) {
    Phaser.Sprite.call(this, game, x, y, 'player');

    // Save the target that this Follower will follow
    // The target is any object with x and y properties
    this.target = target;

    // Set the pivot point for this sprite to the center
    this.anchor.setTo(0.5, 0.5);

    // Enable physics on this object
    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    // Define constants that affect motion
    this.MAX_SPEED = 1000; // pixels/second
    this.MIN_DISTANCE = 20; // pixels
    this.SMOKE_LIFETIME = 1000; // milliseconds

    this.smokeEmitter = this.game.add.emitter(0, 0, 1);
    this.smokeEmitter.gravity = 0;
    this.smokeEmitter.setXSpeed(-80, -50);
    this.smokeEmitter.setYSpeed(0, 0); // make smoke drift upwards
    this.smokeEmitter.setAlpha(1, 0, this.SMOKE_LIFETIME, Phaser.Easing.Linear.InOut);
    this.smokeEmitter.makeParticles('smoke');
    this.smokeEmitter.start(false, 400, 10);

    this.smokePosition = new Phaser.Point(this.width/2, 0);
};

Follower.prototype = Object.create(Phaser.Sprite.prototype);
Follower.prototype.constructor = Follower;

Follower.prototype.update = function() {
    // Calculate distance to target
    var distance = this.game.math.distance(this.x, this.y, this.target.x, this.target.y);

    // If the distance > MIN_DISTANCE then move
    if (distance > this.MIN_DISTANCE) {
        // Calculate the angle to the target
        var rotation = this.game.math.angleBetween(this.x, this.y, this.target.x, this.target.y);

        // Calculate velocity vector based on rotation and this.MAX_SPEED
        this.body.velocity.x = Math.cos(rotation) * this.MAX_SPEED;
        this.body.velocity.y = Math.sin(rotation) * this.MAX_SPEED;
    } else {
        this.body.velocity.setTo(0, 0);
    }

    // Rotate the point representing the relative position of the emitter around
    // the center of the missile.
    var p = this.smokePosition.rotate(0, 0, this.rotation);

    // Position the smoke emitter at the new coordinates relative to the center
    // of the missile
    this.smokeEmitter.x = this.x - p.x;
    this.smokeEmitter.y = this.y - p.y;

    // Calculate the angle from the missile to the mouse cursor game.input.x
    // and game.input.y are the mouse position; substitute with whatever
    // target coordinates you need.
    var targetAngle = this.game.math.angleBetween(
        this.x, this.y,
        this.game.input.activePointer.x, this.game.input.activePointer.y
    );
};

// Try to get a used explosion from the explosionGroup.
// If an explosion isn't available, create a new one and add it to the group.
// Setup new explosions so that they animate and kill themselves when the
// animation is complete.
GameState.prototype.getExplosion = function(x, y) {
    // Get the first dead explosion from the explosionGroup
    var explosion = this.explosionGroup.getFirstDead();

    // If there aren't any available, create a new one
    if (explosion === null) {
        explosion = this.game.add.sprite(0, 0, 'explosion');
        explosion.anchor.setTo(0.5, 0.5);

        // Add an animation for the explosion that kills the sprite when the
        // animation is complete
        var animation = explosion.animations.add('boom', [0,1,2,3], 60, false);
        animation.killOnComplete = true;

        // Add the explosion sprite to the group
        this.explosionGroup.add(explosion);
    }

    // Revive the explosion (set it's alive property to true)
    // You can also define a onRevived event handler in your explosion objects
    // to do stuff when they are revived.
    explosion.revive();

    // Move the explosion to the given coordinates
    explosion.x = x;
    explosion.y = y;

    // Set rotation of the explosion at random for a little variety
    explosion.angle = this.game.rnd.integerInRange(0, 360);

    // Play the animation
    explosion.animations.play('boom');

    // Return the explosion itself in case we want to do anything else with it
    return explosion;
};

GameState.prototype.shootBullet = function() {
    // Enforce a short delay between shots by recording
    // the time that each bullet is shot and testing if
    // the amount of time since the last shot is more than
    // the required delay.
    if (this.lastBulletShotAt === undefined) this.lastBulletShotAt = 0;
    if (this.game.time.now - this.lastBulletShotAt < this.SHOT_DELAY) return;
    this.lastBulletShotAt = this.game.time.now;

    // Get a dead bullet from the pool
    var bullet = this.bulletPool.getFirstDead();

    // If there aren't any bullets available then don't shoot
    if (bullet === null || bullet === undefined) return;

    // Revive the bullet
    // This makes the bullet "alive"
    bullet.revive();

    // Bullets should kill themselves when they leave the world.
    // Phaser takes care of this for me by setting this flag
    // but you can do it yourself by killing the bullet if
    // its x,y coordinates are outside of the world.
    bullet.checkWorldBounds = true;
    bullet.outOfBoundsKill = true;

    // Set the bullet position to the gun position.
    bullet.reset(this.player.x, this.player.y);

    // Shoot it
    bullet.body.velocity.x = this.BULLET_SPEED;
    bullet.body.velocity.y = 0;
};

var game = new Phaser.Game(1024, 576, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);
