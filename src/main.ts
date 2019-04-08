import { Game } from "./Game";
import TileSetLoader from "./TileSetLoader";
import * as PIXI from "pixi.js";
import TileMapLoader from "./TileMapLoader";

(async function() 
{
    PIXI.loader.use(TileSetLoader);
    PIXI.loaders.Loader.addPixiMiddleware(TileSetLoader);
    PIXI.loader.use(TileMapLoader);
    PIXI.loaders.Loader.addPixiMiddleware(TileMapLoader);

    var application = new PIXI.Application(window.innerWidth, window.innerHeight, { backgroundColor: 0x7777E0, autoStart: false });
    document.getElementById("container")!.appendChild(application.view);

    var game = new Game(application);
    await game.load();
    game.run();
})();