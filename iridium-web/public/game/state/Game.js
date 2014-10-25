dt.Game = function(game) {};

dt.Game.prototype = {
    create: function() {
        // TODO Placeholder, remove when we have a game...
        var text = this.add.text(this.world.centerX, this.world.centerY, 'Iridium', {
            font:   '65px Arial',
            fill:   '#ff0044',
            align:  'center'
        });

        text.anchor.set(0.5);
        // End placeholder
    },

    update: function() {

    },

    quitGame: function(pointer) {
        this.state.start(dt.state.TITLE);
    }
};