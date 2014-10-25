dt = {
    score:              0,
    validOrientation:   true,

    state: {
        BOOT:       'boot',
        PRELOAD:    'preload',
        TITLE:      'title',
        GAME:       'game'
    },

    device: {
        screen: {
            max: {
                x: 1024,
                y: 576
            },

            min: {
                x: 800,
                y: 450
            }
        }
    },

    asset: {
        TITLE_MUSIC: {
            key:    'title-music',
            path:   ''
        },

        PRELOADER_BAR: {
            key:    'preloader-bar',
            path:   '../assets/images/preloader_bar.png'
        },

        PRELOADER_BACKGROUND: {
            key:    'preloader-background',
            path:   '../assets/images/preloader_background.jpg'
        }
    }
};

dt.Boot = function(game) {};

dt.Boot.prototype = {
    init: function() {
        this.input.maxPointers = 1;

        this.stage.disableVisibilityChange = true;

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        var screen = dt.device.screen;

        if (this.game.device.desktop) {
            // TODO Scaling on iOS doesn't seem to work of this is enabled. Need to find out why.
            this.scale.setMinMax(screen.min.x, screen.min.y, screen.max.x, screen.max.y);
        }
        else {
            this.scale.forceOrientation(true, false);
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
        }

        this.scale.setResizeCallback(this.gameResized, this);
        this.scale.setScreenSize(true);
        this.scale.refresh();
    },

    preload: function() {
        // TODO Enable this when we have preloader assets.
        //this.load.image(dt.asset.PRELOADER_BACKGROUND.key, dt.asset.PRELOADER_BACKGROUND.path);
        //this.load.image(dt.asset.PRELOADER_BAR.key, dt.asset.PRELOADER_BAR.path);
    },

    create: function() {
        this.state.start(dt.state.PRELOAD);
    },

    gameResized: function(width, height) {

    },

    enterIncorrectOrientation: function () {
        dt.validOrientation = false;
    },

    leaveIncorrectOrientation: function () {
        dt.validOrientation = true;
    }
};