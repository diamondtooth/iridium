dt.Preload = function(game) {};

dt.Preload = function(game) {
    this.background = null;
    this.preloadBar = null;
    this.ready      = false;
};

dt.Preload.prototype = {
    preload: function () {
        // TODO Enable this when we have preloader assets.
        //this.background = this.add.sprite(0, 0, dt.asset.PRELOADER_BACKGROUND.key);
        //this.preloadBar = this.add.sprite(300, 400, dt.asset.PRELOADER_BAR.key);
        //
        //this.load.setPreloadSprite(this.preloadBar);

        // TODO Load assets here...
    },

    create: function () {
        // TODO Enable this when we have a preloader configured.
        //this.preloadBar.cropEnabled = false;
    },

    update: function () {
        // TODO Enable this when we have title music.
        //if (this.cache.isSoundDecoded(dt.asset.TITLE_MUSIC) && this.ready == false) {
        //    this.ready = true;
        //
        //    this.state.start(dt.state.TITLE);
        //}

        this.ready = true;

        this.state.start(dt.state.TITLE);
    }
};