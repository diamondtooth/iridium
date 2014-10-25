(function () {
    var game = new Phaser.Game(1024, 576, Phaser.AUTO, dt.IRIDIUM);

    game.state.add(dt.state.BOOT, dt.Boot);
    game.state.add(dt.state.PRELOAD, dt.Preload);
    game.state.add(dt.state.TITLE, dt.Title);
    game.state.add(dt.state.GAME, dt.Game);

    game.state.start(dt.state.BOOT);
})();