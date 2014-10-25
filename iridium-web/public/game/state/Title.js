dt.Title = function(game) {
    this.playButton = null;
};

dt.Title.prototype = {
    create: function() {
        // TODO Placeholder, replace this when we have a proper menu.
        this.playButton = this.add.text(this.world.centerX, this.world.centerY, 'Play Game', {
            font:   '65px Arial',
            fill:   '#ff0044',
            align:  'center'
        });

        this.playButton.anchor.set(0.5);

        this.playButton.inputEnabled = true;

        this.playButton.events.onInputDown.add(this.startGame, this);
        // End placeholder
    },

    update: function() {

    },

    startGame: function(pointer) {
        this.state.start(dt.state.GAME);
    }
};