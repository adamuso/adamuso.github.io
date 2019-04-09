define(["require", "exports", "./Game", "./TileSetLoader", "pixi.js", "./TileMapLoader"], function (require, exports, Game_1, TileSetLoader_1, PIXI, TileMapLoader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    (async function () {
        PIXI.loader.use(TileSetLoader_1.default);
        PIXI.loaders.Loader.addPixiMiddleware(TileSetLoader_1.default);
        PIXI.loader.use(TileMapLoader_1.default);
        PIXI.loaders.Loader.addPixiMiddleware(TileMapLoader_1.default);
        var application = new PIXI.Application(window.innerWidth, window.innerHeight, { backgroundColor: 0x7777E0, autoStart: false });
        document.getElementById("container").appendChild(application.view);
        window.addEventListener('resize', () => application.renderer.resize(window.innerWidth, window.innerHeight));
        var game = new Game_1.Game(application);
        await game.load();
        game.run();
    })();
});
//# sourceMappingURL=main.js.map